import { useEffect, useState } from 'react';
import { Stack, Text, Title } from '@mantine/core';
import PublicInfoPageLayout from '../components/common/PublicInfoPageLayout';
import { fetchPublicSiteSettings } from '../lib/site-settings';

export default function AboutPage() {
  const [aboutShort, setAboutShort] = useState('');

  useEffect(() => {
    fetchPublicSiteSettings().then((settings) => setAboutShort(settings.about_short));
  }, []);

  return (
    <PublicInfoPageLayout
      eyebrow="Tentang Kami"
      title="Mengenai Jemput"
      subtitle="Platform kad kahwin digital yang dibina untuk memudahkan pasangan Malaysia merancang, berkongsi, dan mengurus jemputan majlis dengan lebih kemas."
    >
      <Stack gap="lg">
        <div>
          <Title order={3} mb="sm">Siapa Kami</Title>
          <Text style={{ lineHeight: 1.9 }}>
            {aboutShort || 'Jemput ialah platform jemputan digital yang menggabungkan reka bentuk premium, aliran RSVP yang mudah, dan pengurusan tetamu yang praktikal dalam satu tempat.'}
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">Apa Yang Kami Bantu</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Kami membantu pasangan menghasilkan kad jemputan digital yang kemas, mesra telefon, dan mudah dikongsi melalui WhatsApp atau pautan peribadi tanpa perlu bergantung pada proses manual yang rumit.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">Fokus Kami</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Fokus utama kami ialah pengalaman yang cantik, pantas, dan jelas: templat premium, susun atur yang mudah disunting, RSVP yang teratur, dan ciri tambahan seperti muzik, galeri, salam kaut digital, dan chatbot untuk pelan tertentu.
          </Text>
        </div>
      </Stack>
    </PublicInfoPageLayout>
  );
}
