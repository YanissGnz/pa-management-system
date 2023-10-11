"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { closeDialog } from "@/app/store/slices/deleteDialogSlice"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { archivePayment } from "@/app/actions"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import InvoicePDFView from "./InvoicePDFView"

export default function AccountingDialogs() {
  const dispatch = useAppDispatch()
  const { isOpen, payment } = useAppSelector(state => state.printDialog)
  const { id, isOpen: isArchiveOpen } = useAppSelector(state => state.deleteDialog)

  const handleArchivePayment = () => {
    if (!id) return
    dispatch(closeDialog())
    const promise = new Promise((resolve, reject) => {
      archivePayment(id)
        .then(result => {
          if (result.success) {
            resolve("Payment archived successfully")
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
    toast.promise(promise, {
      loading: "Archiving payment...",
      success: () => "Payment archived successfully",
      error: "Error archiving payment",
    })
  }
  return (
    <>
      <Sheet open={isOpen} onOpenChange={open => !open && dispatch(closeDialog())}>
        <SheetContent side='bottom' className='h-screen px-0'>
          <SheetHeader>
            <SheetTitle>Print Receipt</SheetTitle>
          </SheetHeader>
          {payment && (
            <PDFViewer className='h-full w-full'>
              <InvoicePDFView payment={payment} />
            </PDFViewer>
          )}
        </SheetContent>
      </Sheet>
      <AlertDialog
        open={isArchiveOpen}
        onOpenChange={open => {
          if (!open) dispatch(closeDialog())
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm action</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to archive this payment?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Button variant={"ghost"}>Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleArchivePayment}
              asChild
            >
              <Button variant={"destructive"}>Archive</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
