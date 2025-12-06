import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function useApiBase() {
  const { siteConfig } = useDocusaurusContext();
  return (siteConfig.customFields as any).API_URL as string;
}