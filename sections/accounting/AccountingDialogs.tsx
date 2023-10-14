"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { closeDialog } from "@/app/store/slices/deleteDialogSlice"
import { closeDialog as closePrintDialog } from "@/app/store/slices/printDialogSlice"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { archivePayment } from "@/app/actions"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
      <Sheet open={isOpen} onOpenChange={open => !open && dispatch(closePrintDialog())}>
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
      <Dialog
        open={isArchiveOpen}
        onOpenChange={open => {
          if (!open) dispatch(closeDialog())
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
          </DialogHeader>
          <DialogDescription>Are you sure you want to archive this payment?</DialogDescription>
          <DialogFooter>
            <Button variant={"ghost"} onClick={() => dispatch(closeDialog())}>
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleArchivePayment}
            >
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
