-- Migration: ajoute la colonne activation_token sur public.cards
--
-- Pourquoi :
-- Aujourd'hui un attaquant qui devine une id séquentielle (ex. "00042") peut
-- en théorie activer une plaque qu'il ne possède pas. Pour les NOUVELLES
-- plaques, on intègre un token aléatoire dans le QR code en plus de l'id.
-- L'API d'activation refusera l'opération si la carte a un token et qu'il
-- ne correspond pas. Pour les anciennes plaques (token NULL), le flow legacy
-- continue de fonctionner — pas de breakage côté client.
--
-- Comment générer un token pour une nouvelle plaque :
--   update public.cards set activation_token = encode(gen_random_bytes(16), 'hex')
--   where id = '00042';
--
-- L'URL du QR code devient alors :
--   https://www.iconrev.com/activate?id=00042&t=<activation_token>

alter table public.cards
  add column if not exists activation_token text;

-- Optionnel : si tu veux générer rétroactivement des tokens pour TOUTES les
-- plaques déjà émises, décommente. Attention : ça invalidera les QR codes
-- déjà imprimés sur des plaques en circulation (à n'utiliser que si tu
-- réimprimes les plaques).
--
-- update public.cards
--   set activation_token = encode(gen_random_bytes(16), 'hex')
--   where activation_token is null;
