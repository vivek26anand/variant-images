import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  InlineStack,
  Text,
  Divider,
  Button
} from '@shopify/ui-extensions-react/admin';
import { useEffect, useState } from 'react';
import { getProductImages, getProductVariants } from './utils.js';
// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-details.block.render';

export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n and data.
  const {extension: {target}, i18n, data, navigation} = useApi(TARGET);
  const productId = data?.selected[0].id;
  const [productImages, setProductImages] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  useEffect(() => {
    console.log(productId);
    getProductImages(productId).then((images) => {
      setProductImages(images);
      console.log(images);
    });
    getProductVariants(productId).then((variants) => {
      setProductVariants(variants);
      console.log(variants);
    });
  }, []);
  return (
    // The AdminBlock component provides an API for setting the title and summary of the Block extension wrapper.
    <AdminBlock summary="">
      <BlockStack gap>
        {productVariants.map((variant) => {
          return (
            <>
            <Divider />
            <InlineStack inlineAlignment="space-between" gap blockSize={50}>
              <Text>
              {variant.title}
            </Text>
            <Button primary onPress={()=>{
              	navigation?.navigate(
                  `extension:variant-image-action?variantId=${variant.id}&productId=${productId}`
                )
            }}>
               Configure Images
            </Button>
            </InlineStack>
            </>
          );
        })}
      </BlockStack>
    </AdminBlock>
  );
}