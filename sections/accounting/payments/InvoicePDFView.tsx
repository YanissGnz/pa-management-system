/* eslint-disable jsx-a11y/alt-text */

"use client"

import { TPaymentSchema } from "@/types/Payment"
import { Page, Text, Image, View, Document, StyleSheet, Font } from "@react-pdf/renderer"
import { format } from "date-fns"
import logo from "public/pa-logo.jpg"

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
      padding: 5,
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    logo: {
      height: 35,
    },
    statusView: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 5,
    },
    status: {
      fontSize: 8,
      fontWeight: "bold",
    },
    paymentTitle: {
      fontSize: 8,
    },
    // mb-10 grid grid-cols-2
    info: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 5,
    },
  })
  return (
    <Document>
      <Page size='A7' style={styles.page} orientation='landscape'>
        <View style={styles.header}>
          <Image src={logo.src} style={styles.logo} />
          <View style={styles.statusView}>
            <Text>
              {payment.status === "completed" && <Text style={styles.status}>Complete</Text>}
              {payment.status === "not paid" && <Text style={styles.status}>Not paid</Text>}
              {payment.status === "incomplete" && <Text style={styles.status}>Incomplete</Text>}
            </Text>
            {/* <Text style={styles.paymentTitle}>{payment.paymentTitle}</Text> */}
          </View>
        </View>
        <View style={styles.info}>
          <View style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Text style={{ fontSize: 10 }}>Present Academy</Text>
            <Text style={{ fontSize: 10 }}>N° 28, Av.Ahmed Maghrabbi, Blida, Algeria</Text>
            <Text style={{ fontSize: 10 }}>0770 11 44 92</Text>
          </View>
        </View>

        <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 5 }}>Invoice Details</Text>
        {/* Items list into a table */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 5,
          }}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 50 }}>
            <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 1 }}>#</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.7 }}>
            <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 1 }}>Student</Text>
          </View>

          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.2 }}>
            <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 1 }}>Class</Text>
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
              marginBottom: 5,
            }}
          >
            <View style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 50 }}>
              <Text style={{ fontSize: 8 }}>{index + 1}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.7 }}>
              <Text style={{ fontSize: 8 }}>{student.fullName}</Text>
            </View>

            <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.2 }}>
              <Text style={{ fontSize: 8 }}>
                {student.classes && student.classes?.length > 0
                  ? student.classes?.map(c => c.title).join(", ")
                  : "No class"}
              </Text>
            </View>
          </View>
        ))}
        {/* Subtotal, Tax, Total */}
        {/* {payment.discount && ( */}
        {payment.discount && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 5,
            }}
          >
            <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.2 }}>
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: "bold",
                  marginBottom: 1,
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  display: "flex",
                }}
              >
                Discount
              </Text>

              <Text style={{ fontSize: 8 }}>{payment.discount} Da</Text>
            </View>
          </View>
        )}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <View
            style={{
              display: "flex",
              gap: 4,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontWeight: "extrabold",
                marginBottom: 1,
              }}
            >
              Total
            </Text>

            <Text style={{ fontSize: 8 }}>{payment.total} Da</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 5,
          }}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.5 }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", marginBottom: 1 }}>Created At</Text>
            <Text style={{ fontSize: 8 }}>
              {format(new Date(payment.date), "dd/MM/yyyy HH:mm")}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column", gap: 4, flex: 0.5 }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", marginBottom: 1 }}>Due Date</Text>
            <Text style={{ fontSize: 8 }}>{format(new Date(payment.due), "dd/MM/yyyy")}</Text>
          </View>
        </View>
        {/* Notes */}
      </Page>
    </Document>
  )
}
export default InvoicePDFView
