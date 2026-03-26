import { Stack, Text, Title } from '@mantine/core';
import PublicInfoPageLayout from '../components/common/PublicInfoPageLayout';

export default function PrivacyPage() {
  return (
    <PublicInfoPageLayout
      eyebrow="Privasi"
      title="Dasar Privasi"
      subtitle="Dasar ini menerangkan jenis data yang kami kumpul, bagaimana data digunakan, dan pilihan yang anda miliki berkaitan maklumat peribadi anda."
    >
      <Stack gap="lg">
        <div>
          <Title order={3} mb="sm">1. Maklumat Yang Kami Kumpul</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Kami boleh mengumpul maklumat seperti nama, alamat e-mel, nombor telefon, maklumat akaun, data jemputan, rekod pembayaran, dan data penggunaan platform apabila anda mendaftar atau menggunakan perkhidmatan kami.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">2. Cara Kami Menggunakan Data</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Data digunakan untuk menyediakan perkhidmatan, memproses pembayaran, menyokong pengurusan jemputan, meningkatkan prestasi produk, berkomunikasi dengan anda, dan menjaga keselamatan sistem.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">3. Perkongsian Dengan Pihak Ketiga</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Kami hanya berkongsi data apabila perlu untuk operasi perkhidmatan, contohnya dengan penyedia pembayaran, penyedia infrastruktur, atau alat komunikasi yang relevan. Kami tidak menjual data peribadi anda kepada pihak ketiga.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">4. Penyimpanan & Keselamatan</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Kami mengambil langkah munasabah dari segi teknikal dan organisasi untuk melindungi data pengguna. Walau bagaimanapun, tiada sistem dalam talian yang boleh dijamin 100% bebas risiko.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">5. Hak Anda</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Anda boleh meminta pembetulan maklumat yang tidak tepat, mengemas kini butiran akaun, atau menghubungi kami untuk pertanyaan lanjut berkaitan pemprosesan data anda.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">6. Kemas Kini Dasar</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Dasar ini boleh dikemas kini dari semasa ke semasa untuk mencerminkan perubahan operasi atau keperluan undang-undang. Tarikh versi terkini hendaklah dirujuk pada halaman ini.
          </Text>
        </div>
      </Stack>
    </PublicInfoPageLayout>
  );
}
