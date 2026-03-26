import { Stack, Text, Title } from '@mantine/core';
import PublicInfoPageLayout from '../components/common/PublicInfoPageLayout';

export default function TermsPage() {
  return (
    <PublicInfoPageLayout
      eyebrow="Terma"
      title="Terma & Syarat"
      subtitle="Dokumen ini menerangkan syarat penggunaan platform Jemput, termasuk penggunaan akaun, pembayaran, kandungan pengguna, dan had tanggungjawab."
    >
      <Stack gap="lg">
        <div>
          <Title order={3} mb="sm">1. Penerimaan Terma</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Dengan mengakses atau menggunakan Jemput, anda bersetuju untuk mematuhi terma ini. Jika anda tidak bersetuju dengan mana-mana bahagian, anda hendaklah berhenti menggunakan platform ini.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">2. Akaun Pengguna</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Anda bertanggungjawab memastikan maklumat akaun adalah tepat dan terkini. Anda juga bertanggungjawab menjaga kerahsiaan akses akaun anda serta semua aktiviti yang berlaku di bawah akaun tersebut.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">3. Kandungan & Hak Milik</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Anda mengekalkan hak terhadap kandungan yang anda muat naik atau hasilkan. Walau bagaimanapun, anda memberi Jemput kebenaran yang diperlukan untuk memproses, menyimpan, dan memaparkan kandungan tersebut bagi tujuan menyediakan perkhidmatan.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">4. Pembayaran & Akses</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Sesetengah ciri hanya tersedia selepas pembayaran berjaya. Harga, tempoh aktif, dan ciri pelan akan dipaparkan semasa pembelian. Bayaran dibuat sekali sahaja melainkan dinyatakan sebaliknya.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">5. Penggunaan Yang Dilarang</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Anda tidak dibenarkan menggunakan platform untuk tujuan menyalahi undang-undang, memuat naik kandungan yang melanggar hak pihak ketiga, atau cuba mengganggu sistem, keselamatan, atau operasi Jemput.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">6. Had Tanggungjawab</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Jemput disediakan atas dasar “seadanya” dan “seperti tersedia”. Kami berusaha memastikan platform stabil dan boleh digunakan, namun tidak memberi jaminan bahawa perkhidmatan akan sentiasa bebas gangguan atau ralat.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">7. Perubahan Terma</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Kami boleh mengemas kini terma ini dari semasa ke semasa. Versi terkini akan dipaparkan di halaman ini, dan penggunaan berterusan anda dianggap sebagai penerimaan terhadap perubahan tersebut.
          </Text>
        </div>
      </Stack>
    </PublicInfoPageLayout>
  );
}
