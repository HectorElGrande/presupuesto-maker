import { Text } from "@react-pdf/renderer";

export function FooterPDF({ numero, total, vencimiento }: { numero: string, total: number, vencimiento: string }) {
  return (
    <>
      <Text
        fixed
        style={{
          position: 'absolute',
          bottom: 20,
          left: 30,
          fontSize: 7,
        }}
      >
        {`${numero} - ${total.toFixed(2)}€  /  Vencimiento ${vencimiento}`}
      </Text>
      <Text
        fixed
        style={{
          position: 'absolute',
          bottom: 20,
          right: 30,
          fontSize: 7,
        }}
        render={({ pageNumber, totalPages }) => `Pág. ${pageNumber}/${totalPages}`}
      />
    </>
  );
}
