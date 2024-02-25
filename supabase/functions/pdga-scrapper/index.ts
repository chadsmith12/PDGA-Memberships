// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom"
import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import { Database } from "../_shared/schema.gen.ts";

type PdgaHistoryInsert = Database['public']['Tables']['pdga_history']['Insert']
const pdgaActiveSearchUrl = 'https://www.pdga.com/players?FirstName=&LastName=&PDGANum=&Status=Current&Gender=All&Class=All&MemberType=All&City=&StateProv=All&Country=All&Country_1=All&UpdateDate=&order=PDGANum&sort=desc'

function getClient(req: Request) {
  const auth = req.headers.get('Authorization')!
  const url = Deno.env.get('SUPABASE_URL') ?? ''
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

  return createClient<Database>(url, anonKey, {
    global: { headers: { Authorization: auth } }
  })
}

async function fetchPage(url: string): Promise<string | undefined> {
    const response = await fetch(url)
    const data = await response.text()

    return data
}

async function fetchDocument(url: string) {
    const htmlData = await fetchPage(url)
    const dom = new JSDOM(htmlData)

    return dom.window.document
}

function extractLatestPDGANumber(document: Document): number | undefined {
    const pdgaNumberSelector = '#block-system-main > div > div > div > div.view-content > div > table > tbody > tr.odd.views-row-first > td.views-field.views-field-PDGANum.active.pdga-number'
    const pdgaNumber = document.querySelector(pdgaNumberSelector)

    if (!pdgaNumber || !pdgaNumber.textContent ) {
        return undefined
    }

    return parseInt(pdgaNumber.textContent)
}

function extractNumberActivePDGAMembers(document: Document): number | undefined {
    const totalSelector = '#block-system-main > div > div > div > div.view-footer > p'
    const totalText = document.querySelector(totalSelector)

    if (!totalText || !totalText.textContent) {
        return undefined
    }

    const total = totalText.textContent.split('of')[1]

    return parseInt(total)
}

async function fetchLatestData() {
    const document = await fetchDocument(pdgaActiveSearchUrl)
    
    return {
      latestPdgaNumber: extractLatestPDGANumber(document),
      numberMembers: extractNumberActivePDGAMembers(document)
    }
}


Deno.serve(async (req) => {
 const data = await fetchLatestData() 
  if (!data.latestPdgaNumber || !data.numberMembers) {
    console.log("Failed to get the latest pdga number and/or the current number members")
    return new Response(null, {status: 500})
  }

  const client = getClient(req)
  const { error } = await client.from('pdga_history')
    .insert({number_members: data.numberMembers, pdaga_number: data.latestPdgaNumber})

  if (error) {
    console.log(`Error inserting into the pdga_history database: ${error.message}`)
    return new Response(null, { status: 500 })    
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/pdga-scrapper' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
