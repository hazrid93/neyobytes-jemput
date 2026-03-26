import { Stack, Text, Title } from '@mantine/core';
import PublicInfoPageLayout from '../components/common/PublicInfoPageLayout';

export default function RefundPage() {
  return (
    <PublicInfoPageLayout
      eyebrow="Bayaran Balik"
      title="Polisi Bayaran Balik"
      subtitle="Halaman ini menerangkan dasar bayaran balik untuk pelan Jemput, termasuk situasi yang layak dipertimbangkan dan cara membuat permohonan."
    >
      <Stack gap="lg">
        <div>
          <Title order={3} mb="sm">1. Sifat Produk</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Jemput menyediakan produk dan perkhidmatan digital. Oleh sebab akses kepada ciri berbayar boleh diberikan serta-merta selepas pembayaran berjaya, semua permohonan bayaran balik akan dinilai berdasarkan keadaan kes.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">2. Situasi Yang Boleh Dipertimbangkan</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Kami boleh mempertimbangkan permohonan bayaran balik jika berlaku caj berganda, kesilapan teknikal yang menyebabkan pelan tidak dapat diaktifkan, atau isu kritikal yang menjadikan perkhidmatan berbayar tidak boleh digunakan dalam tempoh munasabah.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">3. Situasi Yang Biasanya Tidak Layak</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Permintaan kerana perubahan fikiran, pembelian tersilap selepas akses digunakan, atau ketidakpuasan terhadap ciri yang telah diterangkan dengan jelas pada halaman harga biasanya tidak layak untuk bayaran balik.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">4. Cara Memohon</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Untuk memohon semakan bayaran balik, hubungi kami melalui e-mel sokongan dengan butiran akaun, tarikh pembayaran, jumlah transaksi, dan penerangan ringkas tentang isu yang dihadapi.
          </Text>
        </div>
        <div>
          <Title order={3} mb="sm">5. Tempoh Semakan</Title>
          <Text style={{ lineHeight: 1.9 }}>
            Kami akan menyemak permohonan secepat mungkin, lazimnya dalam 3 hingga 7 hari bekerja. Jika permohonan diluluskan, tempoh kemasukan semula dana bergantung pada kaedah pembayaran dan institusi kewangan yang terlibat.
          </Text>
        </div>
      </Stack>
    </PublicInfoPageLayout>
  );
}
