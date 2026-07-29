-- Yeh migration blogs table create karta hai — NGO ke articles, news aur updates yahan store honge
-- Isko Supabase ke SQL Editor mein jaake run karo: https://supabase.com/dashboard/project/_/sql/new

CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  category TEXT DEFAULT 'Events',
  read_time TEXT DEFAULT '3 min read',
  author TEXT DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Security pehle! RLS enable karo taaki data poori tarah protected rahe
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Blogs toh public hain — koi bhi website visitor inhe padh sakta hai, koi login ki zaroorat nahi
CREATE POLICY "Allow public read access on blogs" 
ON blogs FOR SELECT 
USING (true);

-- Naya blog likhna, edit karna ya delete karna — yeh sab sirf admin kar sakta hai, public nahi
CREATE POLICY "Allow admin modifications on blogs" 
ON blogs FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
