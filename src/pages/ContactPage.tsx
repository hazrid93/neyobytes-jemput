import { useEffect, useState } from 'react';
import { Group, Stack, Text, Title } from '@mantine/core';
import PublicInfoPageLayout from '../components/common/PublicInfoPageLayout';
import { fetchPublicSiteSettings } from '../lib/site-settings';
import type { SiteSettings } from '../types';

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchPublicSiteSettings().then(setSettings);
  }, []);

  return (
    <PublicInfoPageLayout
      eyebrow="Hubungi Kami"
      title="Kami Sedia Membantu"
      subtitle="Untuk pertanyaan produk, sokongan teknikal, kerjasama, atau isu pembayaran, hubungi kami melalui maklumat di bawah."
    >
      <Stack gap="lg">
        <div>
          <Title order={3} mb="sm">E-mel</Title>
          <Text component="a" href={`mailto:${settings?.contact_email || 'hello@jemput.neyobytes.com'}`} style={{ lineHeight: 1.9 }}>
            {settings?.contact_email || 'hello@jemput.neyobytes.com'}
          </Text>
        </div>
        {(settings?.contact_phone || '').trim() && (
          <div>
            <Title order={3} mb="sm">Telefon</Title>
            <Text component="a" href={`tel:${settings?.contact_phone}`} style={{ lineHeight: 1.9 }}>
              {settings?.contact_phone}
            </Text>
          </div>
        )}
        {(settings?.address || '').trim() && (
          <div>
            <Title order={3} mb="sm">Alamat</Title>
            <Text style={{ lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
              {settings?.address}
            </Text>
          </div>
        )}
        <div>
          <Title order={3} mb="sm">Waktu Respon</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Kami berusaha membalas pertanyaan dalam tempoh 1 hingga 2 hari bekerja. Untuk isu kritikal berkaitan pembayaran atau akses akaun, sila sertakan butiran lengkap supaya kami boleh semak dengan lebih pantas.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">Media Sosial</Title>
          <Group gap="md">
            {(settings?.instagram_url || '').trim() && <Text component="a" href={settings?.instagram_url} target="_blank">Instagram</Text>}
            {(settings?.facebook_url || '').trim() && <Text component="a" href={settings?.facebook_url} target="_blank">Facebook</Text>}
            {(settings?.x_url || '').trim() && <Text component="a" href={settings?.x_url} target="_blank">X</Text>}
          </Group>
        </div>
      </Stack>
    </PublicInfoPageLayout>
  );
}
