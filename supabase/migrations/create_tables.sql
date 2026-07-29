-- Yeh migration file teen important tables banata hai — programs, stories, aur gallery_albums
-- Isko Supabase ke SQL Editor mein jaake run karna hai: https://supabase.com/dashboard/project/_/sql/new

-- Step 1: Pehle hum programs table bana rahe hain — yahan NGO ke saare kaam aur projects store honge
CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bahut zaroori hai yeh line! RLS enable karo taaki koi bhi directly database ko manipulate na kar sake
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Yeh policy bolta hai — koi bhi user, chahe logged in ho ya na ho, programs ko dekh sakta hai (read-only)
CREATE POLICY "Allow public read access on programs" 
ON programs FOR SELECT 
USING (true);

-- Sirf admin (authenticated user) ko permission hai — insert, update, delete sab kuch kar sakta hai
CREATE POLICY "Allow admin modifications on programs" 
ON programs FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);


-- Step 2: Ab success stories table banate hain — log yahan apni inspiring kahaniyaan submit karenge
CREATE TABLE IF NOT EXISTS stories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  quote TEXT,
  image TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS yahan bhi lagana padega, warna security mein bada loophole reh jaayega
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Public sirf approved=true wali stories dekh sakta hai, admin sab dekh sakta hai — filtering yahan hoti hai
CREATE POLICY "Allow read access on stories" 
ON stories FOR SELECT 
USING (approved = true OR auth.role() = 'authenticated');

-- Koi bhi apni story submit kar sakta hai, lekin seedha approved nahi hogi — pehle admin review karega
CREATE POLICY "Allow public insert on stories" 
ON stories FOR INSERT 
WITH CHECK (approved = false);

-- Admin ke paas poori power hai — kisi bhi story ko approve, edit ya delete karo
CREATE POLICY "Allow admin modifications on stories" 
ON stories FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);


-- Step 3: Gallery albums table — yahan NGO ke events aur programs ke photo collections rakhe jaayenge
CREATE TABLE IF NOT EXISTS gallery_albums (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT NOT NULL,
  category TEXT DEFAULT 'Events',
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Har table par RLS enable karna good practice hai — kabhi bhoolna mat yeh step
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;

-- Gallery toh public hai bhai — koi bhi user website par photos dekh sakta hai
CREATE POLICY "Allow public read access on gallery_albums" 
ON gallery_albums FOR SELECT 
USING (true);

-- Albums add karna, update karna, ya delete karna — yeh sab sirf admin hi kar sakta hai
CREATE POLICY "Allow admin modifications on gallery_albums" 
ON gallery_albums FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

