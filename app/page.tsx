async function getArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>MyDreamland — σύνδεση με το CMS</h1>
      {articles.length === 0 ? (
        <p>Δεν βρέθηκαν άρθρα ακόμα στο Strapi.</p>
      ) : (
        <ul>
          {articles.map((article: any) => (
            <li key={article.id}>
              {article.attributes?.title ?? article.title ?? "(χωρίς τίτλο)"}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
