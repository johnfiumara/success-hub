import { getSiteSettings } from "@/actions/cms"
import { SettingsManager } from "@/components/cms/SettingsManager"

export const metadata = { title: "Site Settings | CMS | Success Hub" }

export default async function SettingsPage() {
  const settings = await getSiteSettings()
  return <SettingsManager settings={settings} />
}
