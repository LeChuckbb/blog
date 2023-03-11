//pages/sitemap.xml.js
import useMongo from "../lib/useMongo";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!--We manually set the two URLs we know already-->
      <url>
        <loc>https://lechuck.blog</loc>
      </url>
      ${posts
        .map((post) => {
          console.log(post);
          return `
        <url>
            <loc> ${`https://lechuck.blog/post/${post.urlSlug}`} </loc>
        </url>
      `;
        })
        .join("")}
    </urlset>
  `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { postsCollection } = await useMongo();
  const req = await postsCollection
    .find({}, { projection: { urlSlug: 1 } })
    .toArray();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(req);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
