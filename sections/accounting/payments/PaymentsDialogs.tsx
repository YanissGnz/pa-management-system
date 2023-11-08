"use client"

import { ChangeEvent, useCallback, useState } from "react"
import { PDFViewer } from "@react-pdf/renderer"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { closeDialog } from "@/app/store/slices/deleteDialogSlice"
import {
  closePartialPaymentDialog,
  closeDialog as closePrintDialog,
} from "@/app/store/slices/paymentDialogsSlice"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { addPaymentSlice, archivePayment } from "@/app/actions"
import { toast } from "sonner"
import { useBoolean } from "usehooks-ts"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InvoicePDFView from "./InvoicePDFView"

export default function AccountingDialogs() {
  const dispatch = useAppDispatch()
  const { isOpen, payment, isPartialPaymentOpen } = useAppSelector(state => state.printDialog)
  const { id, isOpen: isArchiveOpen } = useAppSelector(state => state.deleteDialog)
  const [sliceAmount, setSliceAmount] = useState(0)
  const { value: disabled, setTrue, setFalse } = useBoolean(true)

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

  const handleAddPaymentSlice = useCallback(() => {
    if (!payment) return
    dispatch(closePartialPaymentDialog())
    const promise = new Promise((resolve, reject) => {
      addPaymentSlice(payment.id, sliceAmount)
        .then(result => {
          if (result.success) {
            resolve("Payment slice added successfully")
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
    toast.promise(promise, {
      loading: "Adding payment slice...",
      success: () => "Payment slice added successfully",
      error: "Error adding payment slice",
    })
  }, [payment, sliceAmount])
  
  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") return

    const max = (payment?.total || 0) - (payment?.payedAmount || 0)

    

    if (Number(e.target.value) < max) setFalse()
    else {
      setTrue()
      toast.error("Amount must be less than the remaining amount")
    }

    setSliceAmount(Number(e.target.value))
  }, [payment?.payedAmount, payment?.total])

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
      <Dialog
        open={isPartialPaymentOpen}
        onOpenChange={open => {
          if (!open) dispatch(closePartialPaymentDialog())
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add payment slice</DialogTitle>
          </DialogHeader>
          <div className='grid w-full items-center gap-1.5 py-4'>
            <Label htmlFor='amount'>Amount</Label>
            <Input
              type='number'
              id='amount'
              placeholder='Enter the amount'
              onChange={handleAmountChange}
            />
          </div>
          <DialogFooter>
            <Button variant={"ghost"} onClick={() => dispatch(closeDialog())}>
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              className={buttonVariants()}
              onClick={handleAddPaymentSlice}
              disabled={disabled}
            >
              Add payment slice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
