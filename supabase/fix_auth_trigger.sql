-- Trigger per creare automaticamente un profilo utente quando viene creato un utente in auth.users
-- Questo permette di gestire i ruoli (es. 'admin') nella tabella public.profiles

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$;

-- Rimuovi il trigger se esiste già per evitare duplicati
drop trigger if exists on_auth_user_created on auth.users;

-- Crea il trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Istruzioni per creare il PRIMO admin:
-- 1. Iscriviti normalmente (o crea utente da Supabase Dashboard)
-- 2. Esegui SQL: UPDATE public.profiles SET role = 'admin' WHERE email = 'tua@email.com';
