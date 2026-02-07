"use client";

import { useState, useTransition } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { Switch } from "@/ui/switch";
import { Plus } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import { createCashFlow } from "@/lib/db/finance/mutations";

const addCashFlowSchema = z.object({
  accountId: z.string(),
  name: z.string().min(1, "Name is required"),
  direction: z.enum(["in", "out"]),
  amountPence: z.coerce
    .number<number>()
    .min(1, "Amount must be greater than 0"),
  frequency: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  category: z.string().min(1, "Category is required"),
  paymentMethod: z.string().optional(),
  dueDay: z
    .string()
    .transform((val) => parseInt(val, 10) || undefined)
    .pipe(z.coerce.number<number>().min(1).max(28).optional())
    .transform((val) => val?.toString())
    .optional(),
  notes: z.string().optional(),
  isActive: z.boolean(),
});

export function AddCashFlowDialog({}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof addCashFlowSchema>>({
    resolver: zodResolver(addCashFlowSchema),
    defaultValues: {
      accountId: "es_current",
      name: "",
      direction: "out",
      amountPence: 0,
      frequency: "monthly",
      category: "",
      paymentMethod: "",
      dueDay: "",
      notes: "",
      isActive: true,
    },
  });

  function onSubmit(data: z.infer<typeof addCashFlowSchema>) {
    setServerError(null);

    startTransition(async () => {
      try {
        await createCashFlow({
          accountId: data.accountId,
          name: data.name,
          direction: data.direction,
          amountPence: data.amountPence,
          frequency: data.frequency,
          category: data.category,
          paymentMethod: data.paymentMethod || null,
          dueDay: data.dueDay ?? null,
          notes: data.notes || null,
          isActive: data.isActive,
        });

        // Close + reset
        setDialogOpen(false);
        form.reset({
          accountId: data.accountId, // keep last used account
          name: "",
          direction: "out",
          amountPence: 0,
          frequency: "monthly",
          category: "",
          paymentMethod: "",
          dueDay: undefined,
          notes: "",
          isActive: true,
        });
      } catch (e) {
        setServerError(
          e instanceof Error ? e.message : "Failed to save cash flow"
        );
      }
    });
  }

  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add cash flow</DialogTitle>
            <DialogDescription>
              Add a new income or outgoing to track your finances
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="grid gap-4 md:grid-cols-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input id="name" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="direction"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="direction">Direction</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="direction">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">In</SelectItem>
                        <SelectItem value="out">Out</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="amountPence"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="amountPence">Amount (EUR)</FieldLabel>
                    <Input id="amountPence" type="number" step="1" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="frequency"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="accountId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="accountId">Account</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="accountId">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es_current">
                          Spain — Current
                        </SelectItem>
                        <SelectItem value="es_joint">Spain — Joint</SelectItem>
                        <SelectItem value="es_credit_card">
                          Spain — Credit Card
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="category">Category</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="housing">Housing</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="subscriptions">
                          Subscriptions
                        </SelectItem>
                        <SelectItem value="debt_credit">
                          Debt & credit
                        </SelectItem>
                        <SelectItem value="transfers">Transfers</SelectItem>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="paymentMethod"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="paymentMethod">
                      Payment method
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="paymentMethod">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Direct Debit">
                          Direct Debit
                        </SelectItem>
                        <SelectItem value="Standing Order">
                          Standing Order
                        </SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Bank transfer">
                          Bank transfer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="dueDay"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="dueDay">
                      Due day (1-28, optional)
                    </FieldLabel>
                    <Input
                      id="dueDay"
                      type="number"
                      min="1"
                      max="31"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="notes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
                    <Textarea
                      id="notes"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={3}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="isActive"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="horizontal">
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="isActive">Is Active</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {serverError ? (
              <p className="text-sm text-destructive">{serverError}</p>
            ) : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add cash flow"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
