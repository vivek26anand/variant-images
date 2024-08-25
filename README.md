# Shopify Variant Image Manager

## Overview

**Shopify Variant Image Manager** is a custom Shopify app built using the [Shopify App Template - Remix](https://github.com/Shopify/shopify-app-template-remix). This app allows merchants to manage multiple variant images with ease. It also provides the functionality to change the order of images for each product variant, giving complete control over product presentation.

## Features

- **Add Multiple Variant Images**: Merchants can upload and manage multiple images for each product variant.
- **Reorder Variant Images**: Easily change the order of images for better visual representation on the storefront.
- **Intuitive Interface**: User-friendly interface built with the power of Remix and Shopify's Polaris design system.
- **Seamless Integration**: Works directly within your Shopify admin, ensuring a seamless experience.

## Functionality

- **Admin block extensions**: This app uses the [Shopify Admin API](https://shopify.dev/docs/admin-api/rest/reference/admin-blocks) to create a custom block extension in the Shopify admin.

- **Admin action extensions**: This app uses the [Shopify Admin API](https://shopify.dev/docs/admin-api/rest/reference/admin-actions) to create a custom action extension in the Shopify admin.

- **GraphQL Admin API**: This app uses the [Shopify Admin API](https://shopify.dev/docs/admin-api/rest/reference) to fetch and update product variant images.

## Quick start

### Prerequisites

1. You must [download and install Node.js](https://nodejs.org/en/download/) if you don't already have it.
2. You must [create a Shopify partner account](https://partners.shopify.com/signup) if you don’t have one.
3. You must create a store for testing if you don't have one, either a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store).

### Configure shopify.app.toml

Update the `name`, `client_id` and `dev_store_url` in the `shopify.app.toml` file with your app's name and API key.
