"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Shield, Upload, CheckCircle2, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { fraudTypeLabels, statesAndCities } from "@/data/registryData";

const schema = z.object({
  // Tutor
  tutorName: z.string().min(2, "Name is required"),
  mobile: z.string().regex(/^\d{10}$/, "Enter valid 10-digit mobile"),
  whatsappSame: z.boolean().default(false),
  whatsapp: z.string().optional(),
  state: z.string().min(1, "Select state"),
  city: z.string().min(1, "Select city"),
  area: z.string().min(2, "Enter area"),
  // Identity
  aadhaar: z.string().regex(/^\d{12}$/, "Enter valid 12-digit Aadhaar").optional().or(z.literal("")),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  // Complaint
  fraudType: z.string().min(1, "Select fraud type"),
  description: z.string().min(30, "Minimum 30 characters required"),
  incidentDate: z.string().optional(),
  // Agency (private)
  agencyName: z.string().min(2, "Agency name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  agencyPhone: z.string().regex(/^\d{10}$/, "Enter valid 10-digit number"),
  agencyEmail: z.string().email("Enter valid email"),
});

type FormData = z.infer<typeof schema>;

const steps = ["Tutor Details", "Identity", "Complaint", "Agency Info"];

const ReportTutor = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tutorName: "", mobile: "", whatsappSame: false, whatsapp: "",
      state: "", city: "", area: "",
      aadhaar: "", idType: "", idNumber: "",
      fraudType: "", description: "", incidentDate: "",
      agencyName: "", contactPerson: "", agencyPhone: "", agencyEmail: "",
    },
    mode: "onTouched",
  });

  const watchState = form.watch("state");
  const watchWhatsappSame = form.watch("whatsappSame");
  const cities = watchState ? statesAndCities[watchState] || [] : [];

  const stepFields: (keyof FormData)[][] = [
    ["tutorName", "mobile", "state", "city", "area"],
    [],
    ["fraudType", "description"],
    ["agencyName", "contactPerson", "agencyPhone", "agencyEmail"],
  ];

  const canProceed = async () => {
    const fields = stepFields[step];
    if (fields.length === 0) return true;
    const result = await form.trigger(fields);
    return result;
  };

  const next = async () => {
    if (await canProceed()) setStep((s) => Math.min(s + 1, 3));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: FormData) => {
    if (data.whatsappSame) data.whatsapp = data.mobile;
    const { error } = await supabase.from("reported_tutors").insert({
      tutor_name: data.tutorName,
      mobile: data.mobile,
      whatsapp: data.whatsapp || null,
      state: data.state,
      city: data.city,
      area: data.area,
      fraud_type: data.fraudType,
      description: data.description,
      incident_date: data.incidentDate || null,
      agency_name: data.agencyName,
      contact_person: data.contactPerson,
      agency_phone: data.agencyPhone,
      agency_email: data.agencyEmail
    });

    if (error) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Report Submitted", description: "Your report is under review." });
  };

  if (submitted) {
    return (
      <>
        <SEOHead title="Report Submitted | Tutors Parliament" description="Your tutor complaint report has been submitted." />
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Report Submitted Successfully</h2>
            <p className="text-muted-foreground mb-6">Your report has been submitted and is under review. We'll verify the details and update the registry accordingly.</p>
            <Button asChild variant="cta"><a href="/tutor-registry">Back to Registry</a></Button>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead title="Report a Tutor | Tutors Parliament" description="Submit a verified complaint about tutor misconduct." />
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 border-primary/30 text-primary"><Shield className="w-3 h-3 mr-1" /> Secure Submission</Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">Report a Tutor</h1>
            <p className="text-muted-foreground">All submissions are reviewed before publishing.</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {steps.map((label, i) => (
                <div key={label} className="flex items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>{i + 1}</div>
                  <span className="text-xs text-muted-foreground hidden sm:block">{label}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${((step + 1) / 4) * 100}%` }} />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
                  {step === 0 && <Step1 form={form} cities={cities} watchWhatsappSame={watchWhatsappSame} />}
                  {step === 1 && <Step2 form={form} />}
                  {step === 2 && <Step3 form={form} />}
                  {step === 3 && <Step4 form={form} />}
                </div>
              </motion.div>

              {step === 3 && (
                <div className="flex items-start gap-2 p-4 bg-primary/5 border border-primary/10 rounded-xl text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Your identity and agency details are completely secure and never shown publicly. Only masked tutor data is displayed after verification.</span>
                </div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prev} disabled={step === 0}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                {step < 3 ? (
                  <Button type="button" onClick={next}>
                    Next <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button type="submit" variant="cta">Submit Report</Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </>
  );
};

function Step1({ form, cities, watchWhatsappSame }: { form: any; cities: string[]; watchWhatsappSame: boolean }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-foreground">Tutor Details</h3>
      <FormField control={form.control} name="tutorName" render={({ field }) => (
        <FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="Enter tutor's full name" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="mobile" render={({ field }) => (
        <FormItem><FormLabel>Mobile Number *</FormLabel><FormControl><Input placeholder="10-digit mobile" maxLength={10} {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="whatsappSame" render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          <FormLabel className="!mt-0 text-sm">WhatsApp same as mobile</FormLabel>
        </FormItem>
      )} />
      {!watchWhatsappSame && (
        <FormField control={form.control} name="whatsapp" render={({ field }) => (
          <FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input placeholder="10-digit WhatsApp" maxLength={10} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      )}
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="state" render={({ field }) => (
          <FormItem><FormLabel>State *</FormLabel>
            <Select value={field.value} onValueChange={(v) => { field.onChange(v); form.setValue("city", ""); }}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
              <SelectContent>{Object.keys(statesAndCities).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="city" render={({ field }) => (
          <FormItem><FormLabel>City *</FormLabel>
            <Select value={field.value} onValueChange={field.onChange} disabled={cities.length === 0}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
              <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />
      </div>
      <FormField control={form.control} name="area" render={({ field }) => (
        <FormItem><FormLabel>Area *</FormLabel><FormControl><Input placeholder="e.g. Sector 14, Rohini" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
    </>
  );
}

function Step2({ form }: { form: any }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-foreground">Identity Verification</h3>
      <p className="text-sm text-muted-foreground">Optional but helps verify the complaint faster.</p>
      <FormField control={form.control} name="aadhaar" render={({ field }) => (
        <FormItem><FormLabel>Aadhaar Number</FormLabel><FormControl><Input placeholder="12-digit Aadhaar" maxLength={12} {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="idType" render={({ field }) => (
        <FormItem><FormLabel>ID Type</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="aadhaar">Aadhaar</SelectItem>
              <SelectItem value="pan">PAN</SelectItem>
              <SelectItem value="driving_license">Driving License</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )} />
      <FormField control={form.control} name="idNumber" render={({ field }) => (
        <FormItem><FormLabel>ID Number</FormLabel><FormControl><Input placeholder="Enter ID number" {...field} /></FormControl></FormItem>
      )} />
      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Upload proof document (optional)</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG — Max 5MB</p>
      </div>
    </>
  );
}

function Step3({ form }: { form: any }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-foreground">Complaint Details</h3>
      <FormField control={form.control} name="fraudType" render={({ field }) => (
        <FormItem><FormLabel>Fraud Type *</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
            <SelectContent>
              {Object.entries(fraudTypeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select><FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem><FormLabel>Description *</FormLabel><FormControl><Textarea placeholder="Describe the incident in detail (min 30 characters)..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="incidentDate" render={({ field }) => (
        <FormItem><FormLabel>Incident Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
      )} />
      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Upload supporting proof (optional)</p>
        <p className="text-xs text-muted-foreground mt-1">Screenshots, documents — Max 5MB</p>
      </div>
    </>
  );
}

function Step4({ form }: { form: any }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-foreground">Agency Information</h3>
      <p className="text-sm text-muted-foreground">This info is kept private and never displayed publicly.</p>
      <FormField control={form.control} name="agencyName" render={({ field }) => (
        <FormItem><FormLabel>Agency/Institute Name *</FormLabel><FormControl><Input placeholder="Enter agency name" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="contactPerson" render={({ field }) => (
        <FormItem><FormLabel>Contact Person *</FormLabel><FormControl><Input placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="agencyPhone" render={({ field }) => (
        <FormItem><FormLabel>Phone Number *</FormLabel><FormControl><Input placeholder="10-digit number" maxLength={10} {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="agencyEmail" render={({ field }) => (
        <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" placeholder="agency@example.com" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
    </>
  );
}

export default ReportTutor;
