import {useEffect, useState} from 'react';
import {
  reactExtension,
  useApi,
  AdminAction,
  BlockStack,
  Button,
  Text,
  Image,
  InlineStack,
  Checkbox,
  Heading,
  Icon
} from '@shopify/ui-extensions-react/admin';

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-details.action.render';

export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n, close, and data.
  const {extension: {target}, i18n, close, data, intents} = useApi(TARGET);
  const [variantId, setVariantId] = useState(intents?.launchUrl ? new URL(intents?.launchUrl)?.searchParams?.get("variantId") : null);
  const productId = data?.selected[0].id;
  const [productTitle, setProductTitle] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [metafieldId, setMetafieldId] = useState(null);
  const [productVariants, setProductVariants] = useState([]);
  // Use direct API calls to fetch data from Shopify.
  // See https://shopify.dev/docs/api/admin-graphql for more information about Shopify's GraphQL API
  async function getProductVariants(){
    const getProductVariantsQuery = {
      query: `query Product($id: ID!) {
        product(id: $id) {
          variants(first: 50) {
            edges {
              node {
                id
                title
                image {
                  id
                  originalSrc
                }
              }
            }
          }
        }
      }`,
      variables: {id: productId},
    };

    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify(getProductVariantsQuery),
    });

    if (!res.ok) {
      console.error('Network error');
    }

    const productData = await res.json();
    return productData.data.product.variants.edges.map((edge) => edge.node);
  }
  async function getProductVariantMetafields() {
    const getProductVariantMetafieldsQuery = {
      query: `query ProductVariant($id: ID!) {
        productVariant(id: $id) {
          metafield(namespace: "custom_variant_images", key: "images") {
            id
            value
          }
        }
      }`,
      variables: {id: variantId},
    };

    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify(getProductVariantMetafieldsQuery),
    });

    if (!res.ok) {
      console.error('Network error');
    }

    const productVariantData = await res.json();
    console.log(productVariantData);
    // check if metafield exists and return its value else return empty array
    setMetafieldId(productVariantData.data.productVariant?.metafield?.id);
    return productVariantData.data.productVariant?.metafield?.value ? productVariantData.data.productVariant.metafield.value.split(',') : [];
  }
  async function setProductVariantMetafields() {
    const setProductVariantMetafieldsQuery = {
      query: `mutation ProductVariantUpdate($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            metafields(first: 50) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      variables: {
        input: {
          id: variantId,
          metafields: [
            {
              id: metafieldId,
              namespace: "custom_variant_images",
              key: "images",
              value: JSON.stringify(productImages),
              type: "single_line_text_field"
            }
          ]
        }
      }
    };

    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify(setProductVariantMetafieldsQuery),
    });

    if (!res.ok) {
      console.error('Network error');
    }

    const productVariantData = await res.json();
    console.log(productVariantData);
  }
  useEffect(() => {
    (async function getProductInfo() {
      const getProductQuery = {
        query: `query Product($id: ID!) {
          product(id: $id) {
            title
            images(first: 50) {
              edges {
                  node {
                      id
                      originalSrc
                  }
              }
            }
          }
        }`,
        variables: {id: productId},
      };

      const res = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(getProductQuery),
      });

      if (!res.ok) {
        console.error('Network error');
      }

      const productData = await res.json();
      getProductVariants().then((variants) => {
        setProductVariants(variants);
      });
      setProductTitle(productData.data.product.title);
      setProductImages(productData.data.product.images.edges.map((edge) => edge.node));
      getProductVariantMetafields().then((metafields) => {
        // check if metafield exists in variant and return its value else return empty array
        metafields = JSON.parse(metafields);
        if(metafields){
          setProductImages(metafields)
        }
      });
    })();
  }, [variantId]);
  return (
    // The AdminAction component provides an API for setting the title and actions of the Action extension wrapper.
    <AdminAction
      primaryAction={
        <Button
          onPress={() => {
            // in productImages array, find the index of each selected image and move it to the front of the array and remove unselected images
            setProductVariantMetafields().then(()=>{
              close();
            })
          }}
        >
          Done
        </Button>
      }
      secondaryAction={
        <Button
          onPress={() => {
            console.log('closing');
            close();
          }}
        >
          Close
        </Button>
      }
    >
      {variantId? <>
        <Heading size={5}>To add more images upload them in media tab</Heading>
      <InlineStack gap>
       <BlockStack gap >
       {productImages.map((image) => (
          <InlineStack gap blockAlignment='center' inlineAlignment='center'>
            <Checkbox onChange={(e)=>{
              if(e){
                image.selected = true;
                setProductImages([...productImages]);
              }else{
                image.selected = false;
                setProductImages([...productImages]);
              }
            }} checked={
              image.selected ? true : false
            } key={image.id}/>
            <InlineStack inlineSize={100}>
              <Image
                key={image.id}
                source={image.originalSrc}
                alt={productTitle}
              />
            </InlineStack>  
          <Button key={image.id+'1'} onClick={()=>{
            // change order of images with up and down buttons
            const index = productImages.indexOf(image);
            productImages.splice(index, 1);
            productImages.splice(index - 1, 0, image);
            setProductImages([...productImages]);
          }}>
            <Icon name="CircleChevronUpMinor"/>
            </Button>
            <Button key={image.id+'0'} onClick={()=>{
            // change order of images with up and down buttons
            const index = productImages.indexOf(image);
            productImages.splice(index, 1);
            productImages.splice(index + 1, 0, image);
            setProductImages([...productImages]);
            }}>
            <Icon name="CircleChevronDownMinor" />
            </Button>
          </InlineStack>
        ))}
       </BlockStack>
       
      </InlineStack>
      </>:<>
        {/* Show option to select variant and set variant id */}
        <Heading size={5}>Select variant</Heading>
        <BlockStack gap >
        {productVariants.map((variant) => (
          <InlineStack gap blockAlignment='center' inlineAlignment='center'>
            <Checkbox onChange={(e)=>{
              if(e){
                setVariantId(variant.id);
              }
            }} key={variant.id}/>
            <Text key={variant.id+'1'}>{variant.title}</Text>
          </InlineStack>
        ))}
        </BlockStack>
      </>}
    </AdminAction>
  );
}