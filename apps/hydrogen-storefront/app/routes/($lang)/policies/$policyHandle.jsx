import { json } from "@shopify/remix-oxygen";
import { useLoaderData } from "@remix-run/react";

import { PageHeader, Section, Button } from "~/components";
import invariant from "tiny-invariant";

export async function loader({ request, params, context }) {
  invariant(params.policyHandle, "Missing policy handle");
  const handle = params.policyHandle;

  const policyName = handle.replace(/-([a-z])/g, (_, m1) => m1.toUpperCase());

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n.language,
    },
  });

  invariant(data, "No data returned from Shopify API");
  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response(null, { status: 404 });
  }

  return json(
    { policy },
    {
      headers: {
        // TODO cacheLong()
      },
    },
  );
}

export const meta = ({ data }) => {
  return {
    title: data?.policy?.title ?? "Policies",
  };
};

export default function Policies() {
  const { policy } = useLoaderData();

  return (
    <>
      <Section
        padding='all'
        display='flex'
        className='w-full flex-col items-baseline gap-8 md:flex-row'
      >
        <PageHeader
          heading={policy.title}
          className='top-36 grid flex-grow items-start gap-4 md:sticky md:w-5/12'
        >
          <Button
            className='justify-self-start'
            variant='inline'
            to={"/policies"}
          >
            &larr; Back to Policies
          </Button>
        </PageHeader>
        <div className='w-full flex-grow md:w-7/12'>
          <div
            dangerouslySetInnerHTML={{ __html: policy.body }}
            className='prose dark:prose-invert'
          />
        </div>
      </Section>
    </>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }

  query PoliciesQuery(
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) @inContext(language: $language) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
`;