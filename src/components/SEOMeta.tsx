import React, { useEffect } from 'react';
import { Post, SiteSettings } from '../types';

interface SEOMetaProps {
  post?: Post | null;
  settings: SiteSettings;
  pageTitle?: string;
  pageDescription?: string;
}

export const SEOMeta: React.FC<SEOMetaProps> = ({ post, settings, pageTitle, pageDescription }) => {
  useEffect(() => {
    // Determine title & meta description
    const title = post
      ? `${post.seoTitle || post.title} | ${settings.siteName}`
      : pageTitle
      ? `${pageTitle} | ${settings.siteName}`
      : `${settings.siteName} - ${settings.tagline}`;

    const description = post
      ? post.metaDescription || post.excerpt
      : pageDescription || settings.tagline;

    document.title = title;

    // Meta description tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // Open Graph Image
    if (post?.featuredImage) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', post.featuredImage);
    }

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const currentUrl = post ? `${settings.siteUrl}/post/${post.slug}` : window.location.href;
    canonical.setAttribute('href', currentUrl);

    // Dynamic JSON-LD Schema
    const existingSchema = document.getElementById('json-ld-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';

    let schemaObj: any = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: settings.siteName,
      url: settings.siteUrl,
      description: settings.tagline,
      publisher: {
        '@type': 'Organization',
        name: settings.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${settings.siteUrl}/logo.png`,
        },
      },
    };

    if (post) {
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: post.title,
        description: post.excerpt,
        image: [post.featuredImage],
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          '@type': 'Person',
          name: post.author.name,
        },
        publisher: {
          '@type': 'Organization',
          name: settings.siteName,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${settings.siteUrl}/post/${post.slug}`,
        },
      };
    }

    script.text = JSON.stringify(schemaObj);
    document.head.appendChild(script);
  }, [post, settings, pageTitle, pageDescription]);

  return null;
};
