alter table pdga_history enable row level security;

create policy "read_only" on public.pdga_history
for select using (
    true
);

create policy "authenticate_writes" on public.pdga_history
for insert
to authenticated
with check (true);