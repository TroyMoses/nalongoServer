import request, { gql } from "graphql-request";
import { env } from "./env";
import {
  GetPostsArgs,
  GetPostsResponse,
  SubscribeToNewsletterResponse,
  PublicationName,
  GetPostBySlugResponse,
} from "@/lib/types";

const endpoint = env.NEXT_PUBLIC_HASHNODE_ENDPOINT;
const publicationId = env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID;

export async function getBlogName() {
  const query = gql`
    query getBlogName($publicationId: ObjectId!) {
      publication(id: $publicationId) {
        title
        displayTitle
        favicon
      }
    }
  `;

  const response = await request<PublicationName>(endpoint, query, {
    publicationId,
  });

  return {
    title: response.publication.title,
    displayTitle: response.publication.displayTitle,
    favicon: response.publication.favicon,
  };
}

export async function getPosts({ first = 9, pageParam = "" }: GetPostsArgs) {
  const query = gql`
    query Publication {
    publication(host: "bugemauniversity.hashnode.dev") {
      isTeam
      title
      posts(first: 3) {
        edges {
          node {
            title
            brief
            url
            slug
            content{
              text
            }
            coverImage {
              url
            }
            publishedAt
            reactionCount
            author {
              name
              profilePicture
              tagline
            }
          }
        }
      }
    }
  }
  `;

  const response = await request<GetPostsResponse>(endpoint, query, {
    publicationId,
    first,
    after: pageParam,
  });

  return response.publication.posts.edges;
}

export async function subscribeToNewsletter(email: string) {
  const mutation = gql`
    mutation subscribeToNewsletter($publicationId: ObjectId!, $email: String!) {
      subscribeToNewsletter(
        input: { email: $email, publicationId: $publicationId }
      ) {
        status
      }
    }
  `;

  const response = await request<SubscribeToNewsletterResponse>(
    endpoint,
    mutation,
    {
      publicationId,
      email,
    }
  );

  return response;
}

export async function getPostBySlug(slug: string) {
  const query = gql`
    query getPostBySlug($publicationId: ObjectId!, $slug: String!) {
      publication(id: $publicationId) {
        post(slug: $slug) {
          title
          subtitle
          coverImage {
            url
          }
          content {
            html
          }
          author {
            name
            profilePicture
          }
        }
      }
    }
  `;

  const response = await request<GetPostBySlugResponse>(endpoint, query, {
    publicationId,
    slug,
  });

  return response.publication.post;
}

