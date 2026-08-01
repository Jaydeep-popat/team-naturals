const fs = require("fs");
const path = require("path");

const viewsDir = path.join(__dirname, "src/views");
const appDir = path.join(__dirname, "src/app");
const componentsDir = path.join(__dirname, "src/components");

const mappings = [
  { view: "Home.tsx", pages: ["page.tsx"] },
  { view: "About.tsx", pages: ["about/page.tsx"] },
  { view: "Contact.tsx", pages: ["contact/page.tsx"] },
  { view: "Auth.tsx", pages: ["login/page.tsx", "register/page.tsx"] },
  { view: "Cart.tsx", pages: ["cart/page.tsx"] },
  { view: "Address.tsx", pages: ["checkout/address/page.tsx"] },
  { view: "Payment.tsx", pages: ["checkout/payment/page.tsx"] },
  { view: "OrderConfirmation.tsx", pages: ["order-confirmation/page.tsx"] },
  { view: "ProductDetail.tsx", pages: ["product/[slug]/page.tsx"] },
  { view: "Shop.tsx", pages: ["shop/page.tsx", "shop/[category]/page.tsx"] },
  { view: "Wishlist.tsx", pages: ["wishlist/page.tsx"] }
];

function fixImports(content) {
  content = content.replace(/from\s+['"](?:\.\.\/)+components\/(.*?)['"]/g, "from \"@/src/components/$1\"");
  content = content.replace(/from\s+['"](?:\.\.\/)+data\/(.*?)['"]/g, "from \"@/src/data/$1\"");
  content = content.replace(/from\s+['"](?:\.\.\/)+contexts\/(.*?)['"]/g, "from \"@/src/contexts/$1\"");
  content = content.replace(/from\s+['"](?:\.\.\/)+hooks\/(.*?)['"]/g, "from \"@/src/hooks/$1\"");
  content = content.replace(/from\s+['"](?:\.\.\/)+utils\/(.*?)['"]/g, "from \"@/src/utils/$1\"");
  content = content.replace(/from\s+['"]\.\/CheckoutSummary['"]/g, "from \"@/src/components/CheckoutSummary\"");
  
  // Also order confirmation relative imports to views
  content = content.replace(/from\s+['"]\.\.\/\.\.\/views\/(.*?)['"]/g, "from \"@/src/views/$1\"");
  
  return content;
}

if (fs.existsSync(path.join(viewsDir, "CheckoutSummary.tsx"))) {
    let summaryContent = fs.readFileSync(path.join(viewsDir, "CheckoutSummary.tsx"), "utf8");
    summaryContent = fixImports(summaryContent);
    fs.writeFileSync(path.join(componentsDir, "CheckoutSummary.tsx"), summaryContent);
    console.log("Moved CheckoutSummary.tsx to components");
}

mappings.forEach(m => {
  const viewPath = path.join(viewsDir, m.view);
  if (fs.existsSync(viewPath)) {
    let content = fs.readFileSync(viewPath, "utf8");
    const viewName = m.view.replace(".tsx", "");
    const exportRegex = new RegExp(`export\\s+function\\s+${viewName}\\s*\\(`, "g");
    
    content = fixImports(content);
    
    m.pages.forEach(page => {
      let pageContent = content;
      if (exportRegex.test(pageContent)) {
          pageContent = pageContent.replace(exportRegex, `export default function ${viewName}Page(`);
      } else {
          console.warn(`Could not find export function ${viewName} in ${m.view}`);
      }
      
      const targetPath = path.join(appDir, page);
      if (fs.existsSync(targetPath)) {
         fs.writeFileSync(targetPath, pageContent);
         console.log(`Migrated ${m.view} to ${page}`);
      } else {
         console.log(`Warning: target path ${targetPath} does not exist`);
      }
    });
  } else {
      console.warn(`View not found: ${m.view}`);
  }
});
