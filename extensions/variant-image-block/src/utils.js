export async function getProductImages(productId) {
    const req = await makeGraphQLQuery(
        `query {
            product(id: "${productId}") {
                images(first: 50) {
                    edges {
                        node {
                            id
                            originalSrc
                            altText
                        }
                    }
                }
            }
        }`
    );
    return req.data.product.images.edges.map((edge) => edge.node);
}

export async function getProductVariants(productId) {
    const req = await makeGraphQLQuery(
        `query {
            product(id: "${productId}") {
                variants(first: 50) {
                    edges {
                        node {
                            id
                            title
                            image {
                                id
                                originalSrc
                                altText
                            }
                            metafield(namespace: "custom_variant_images", key: "images") {
                                id
                                value
                            }
                        }
                    }
                }
            }
        }`
    );
    return req.data.product.variants.edges.map((edge) => edge.node);
}

async function makeGraphQLQuery(query, variables) {
    const graphQLQuery = {
      query,
      variables,
    };
  
    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify(graphQLQuery),
    });
  
    if (!res.ok) {
      console.error("Network error");
    }
  
    return await res.json();
  }