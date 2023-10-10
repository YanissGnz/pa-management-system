/* eslint-disable jsx-a11y/alt-text */

"use client"

import { TPaymentSchema } from "@/types/Payment"
import { Page, Text, Image, View, Document, StyleSheet, Font } from "@react-pdf/renderer"
import { format } from "date-fns"
import logo from "public/logo.png"

// imp

const InvoicePDFView = ({ payment }: { payment: TPaymentSchema }) => {
  Font.register({
    family: "Public Sans",
    fonts: [
      { src: "public/fonts/PublicSans-Regular.ttf", fontWeight: "normal" },
      { src: "public/fonts/PublicSans-Bold.ttf", fontWeight: "bold" },
    ],
  })

  const styles = StyleSheet.create({
    page: {
      fontFamily: "Courier",
      padding: 15,
      paddingHorizontal: 30,
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 30,
    },
    logo: {
      height: 80,
      width: 80,
      mixBlendMode: "multiply",
    },
    statusView: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 5,
    },
    status: {
      fontSize: 20,
      fontWeight: "bold",
    },
    paymentTitle: {
      fontSize: 14,
    },
    // mb-10 grid grid-cols-2
    info: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
    },
  })
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.header}>
          <Image src={logo.src} style={styles.logo} />
          <View style={styles.statusView}>
            <Text>
              {payment.status === "paid" && <Text style={styles.status}>Paid</Text>}
              {payment.status === "unpaid" && <Text style={styles.status}>Pending</Text>}
              {payment.status === "partial" && <Text style={styles.status}>Partial</Text>}
            </Text>
            {/* <Text style={styles.paymentTitle}>{payment.paymentTitle}</Text> */}
          </View>
        </View>
        <View style={styles.info}>
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.5 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>Invoice From</Text>
            <Text style={{ fontSize: 10 }}>Present Academy</Text>
            <Text style={{ fontSize: 10 }}>N° 28, Av.Ahmed Maghrabbi, Blida, Algeria</Text>
            <Text style={{ fontSize: 10 }}>0770 11 44 92</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.5 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>Created Date</Text>
            <Text style={{ fontSize: 10 }}>
              {format(new Date(payment.date), "dd/MM/yyyy HH:mm")}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.5 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>Due Date</Text>
            <Text style={{ fontSize: 10 }}>{format(new Date(payment.due), "dd/MM/yyyy")}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 20 }}>Invoice Details</Text>
        {/* Items list into a table */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 50 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>#</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.7 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>Student</Text>
          </View>

          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.2 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>Class</Text>
          </View>
        </View>
        {payment?.students?.map((student, index) => (
          <View
            key={student.id}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
            }}
          >
            <View style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 50 }}>
              <Text style={{ fontSize: 12 }}>{index + 1}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.7 }}>
              <Text style={{ fontSize: 12 }}>{student.fullName}</Text>
            </View>

            <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.2 }}>
              <Text style={{ fontSize: 12 }}>{student.classes?.map(c => c.title).join(", ")}</Text>
            </View>
          </View>
        ))}
        {/* Subtotal, Tax, Total */}
        {/* {payment.discount && ( */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 20,
          }}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.1 }}></View>
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.1 }}></View>
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.3 }}></View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 4,
              flex: 0.3,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 5,
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              Discount
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
              gap: 4,
              flex: 0.2,
            }}
          >
            <Text style={{ fontSize: 14 }}>{payment.discount} Da</Text>
          </View>
        </View>
        ){/* } */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 20,
          }}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.1 }}></View>
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.1 }}></View>
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.5 }}></View>
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.1 }}>
            <Text
              style={{ fontSize: 14, fontWeight: "bold", marginBottom: 5, alignItems: "flex-end" }}
            >
              Total
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
              gap: 4,
              flex: 0.2,
            }}
          >
            <Text style={{ fontSize: 14 }}>{payment.total} Da</Text>
          </View>
        </View>
        {/* Notes */}
      </Page>
    </Document>
  )
}
export default InvoicePDFView
