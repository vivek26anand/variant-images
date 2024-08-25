import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export default function AdditionalPage() {

  return (
    <Page>
      <VerticalStack gap="5">
      <Layout>
          <Layout.Section>
            <Card>
             <Text as="h3">Go to product edit page to see variant images option</Text>
            </Card>
          </Layout.Section>
      </Layout>
      </VerticalStack>
  </Page>
  );
}
