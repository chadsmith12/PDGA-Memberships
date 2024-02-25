## PDGA Membership Scrapper

This is a basic web scrapper that will pull down the latest PDGA Number and the number of active members in the PDGA.

This web scrapper is designed to run on Supabase Edge Functions. With it running as a edge function, this then uses the pg-cron extension to call the edge function once a day at midnight UTC. When the edge function is called it will pull down the number of active members and the latest PDGA Number and save them into the database to track the history of PDGA Memberships.

### Goal of Project

The long term goal of this project is to add a small web site that will visually show the history of the PDGA Memberships and how it has grown over time by the time there is enough data to start tracking it.