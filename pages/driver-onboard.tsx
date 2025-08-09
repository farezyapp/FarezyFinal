import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Car, Upload, MapPin, Phone, Mail, User, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Driver onboarding form schema
const driverOnboardingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  licenseNumber: z.string().min(5, "License number is required"),
  licenseExpiry: z.string().min(1, "License expiry date is required"),
  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehicleYear: z.coerce.number().min(2000, "Vehicle must be from year 2000 or newer"),
  vehicleColor: z.string().min(1, "Vehicle color is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  insuranceExpiry: z.string().min(1, "Insurance expiry date is required"),
  operatingArea: z.string().min(1, "Operating area is required"),
  experience: z.string().min(1, "Experience details are required"),
});

type DriverOnboardingForm = z.infer<typeof driverOnboardingSchema>;

export default function DriverOnboard() {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<DriverOnboardingForm>({
    resolver: zodResolver(driverOnboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      licenseNumber: "",
      licenseExpiry: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: 2020,
      vehicleColor: "",
      licensePlate: "",
      vehicleType: "sedan",
      insuranceExpiry: "",
      operatingArea: "",
      experience: "",
    },
  });

  // Submit driver application
  const submitApplication = useMutation({
    mutationFn: async (data: DriverOnboardingForm) => {
      // First create partner application
      const partnerApp = await apiRequest("/api/partner-signup", {
        method: "POST",
        body: {
          companyName: `${data.firstName} ${data.lastName} - Independent Driver`,
          contactName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          address: data.operatingArea,
          city: data.operatingArea,
          operatingArea: data.operatingArea,
          fleetSize: "1",
          serviceTypes: ["standard"],
          description: data.experience,
          yearsInBusiness: "1",
          insuranceProvider: "TBD",
          businessLicense: "TBD",
          taxId: "TBD",
        },
      });

      // Then create driver profile
      const driver = await apiRequest("/api/drivers", {
        method: "POST",
        body: {
          partnerId: partnerApp.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          licenseNumber: data.licenseNumber,
          licenseExpiry: new Date(data.licenseExpiry),
        },
      });

      // Finally create vehicle
      await apiRequest("/api/vehicles", {
        method: "POST",
        body: {
          partnerId: partnerApp.id,
          make: data.vehicleMake,
          model: data.vehicleModel,
          year: data.vehicleYear,
          color: data.vehicleColor,
          licensePlate: data.licensePlate,
          vehicleType: data.vehicleType,
          registrationExpiry: new Date(data.insuranceExpiry),
          insuranceExpiry: new Date(data.insuranceExpiry),
        },
      });

      return { partnerApp, driver };
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your driver application has been submitted for review. We'll contact you within 2-3 business days.",
      });
      setCurrentStep(4);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DriverOnboardingForm) => {
    submitApplication.mutate(data);
  };

  const nextStep = () => {
    const currentFields = getCurrentStepFields();
    form.trigger(currentFields).then((isValid) => {
      if (isValid && currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else if (isValid && currentStep === 3) {
        form.handleSubmit(onSubmit)();
      }
    });
  };

  const getCurrentStepFields = (): (keyof DriverOnboardingForm)[] => {
    switch (currentStep) {
      case 1:
        return ["firstName", "lastName", "email", "phone"];
      case 2:
        return ["licenseNumber", "licenseExpiry", "operatingArea", "experience"];
      case 3:
        return ["vehicleMake", "vehicleModel", "vehicleYear", "vehicleColor", "licensePlate", "vehicleType", "insuranceExpiry"];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  placeholder="John"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  placeholder="Doe"
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="john.doe@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                placeholder="+44 7123 456789"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseNumber">Driving License Number</Label>
                <Input
                  id="licenseNumber"
                  {...form.register("licenseNumber")}
                  placeholder="DL123456789"
                />
                {form.formState.errors.licenseNumber && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.licenseNumber.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  {...form.register("licenseExpiry")}
                />
                {form.formState.errors.licenseExpiry && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.licenseExpiry.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="operatingArea">Operating Area</Label>
              <Input
                id="operatingArea"
                {...form.register("operatingArea")}
                placeholder="London, Manchester, Birmingham..."
              />
              {form.formState.errors.operatingArea && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.operatingArea.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="experience">Driving Experience</Label>
              <Textarea
                id="experience"
                {...form.register("experience")}
                placeholder="Tell us about your driving experience, any commercial driving history..."
                rows={4}
              />
              {form.formState.errors.experience && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.experience.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="vehicleMake">Vehicle Make</Label>
                <Input
                  id="vehicleMake"
                  {...form.register("vehicleMake")}
                  placeholder="Toyota, Ford, BMW..."
                />
                {form.formState.errors.vehicleMake && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.vehicleMake.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input
                  id="vehicleModel"
                  {...form.register("vehicleModel")}
                  placeholder="Camry, Focus, 3 Series..."
                />
                {form.formState.errors.vehicleModel && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.vehicleModel.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="vehicleYear">Vehicle Year</Label>
                <Input
                  id="vehicleYear"
                  type="number"
                  {...form.register("vehicleYear", { valueAsNumber: true })}
                  placeholder="2020"
                />
                {form.formState.errors.vehicleYear && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.vehicleYear.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleColor">Vehicle Color</Label>
                <Input
                  id="vehicleColor"
                  {...form.register("vehicleColor")}
                  placeholder="White, Black, Silver..."
                />
                {form.formState.errors.vehicleColor && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.vehicleColor.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  {...form.register("licensePlate")}
                  placeholder="AB12 CDE"
                />
                {form.formState.errors.licensePlate && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.licensePlate.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select onValueChange={(value) => form.setValue("vehicleType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="wheelchair">Wheelchair Accessible</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.vehicleType && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.vehicleType.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="insuranceExpiry">Insurance Expiry Date</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  {...form.register("insuranceExpiry")}
                />
                {form.formState.errors.insuranceExpiry && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.insuranceExpiry.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in joining Farezy as a driver partner. 
              We'll review your application and contact you within 2-3 business days.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Background check verification</li>
                <li>• Vehicle inspection scheduling</li>
                <li>• Driver training session</li>
                <li>• App setup and onboarding</li>
              </ul>
            </div>
            <Button onClick={() => window.location.href = "/"} className="w-full md:w-auto">
              Return to Home
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    "Personal Information",
    "Driving Details",
    "Vehicle Information",
    "Complete"
  ];

  const stepIcons = [User, FileText, Car, Calendar];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Farezy as a Driver</h1>
          <p className="text-gray-600">
            Start earning money by providing rides in your area
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {stepTitles.map((title, index) => {
              const StepIcon = stepIcons[index];
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <div key={stepNumber} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : isCompleted 
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 hidden md:block ${
                    isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
                  }`}>
                    {title}
                  </span>
                  {index < stepTitles.length - 1 && (
                    <div className={`w-8 h-0.5 ml-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{stepTitles[currentStep - 1]}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Let's start with your basic information"}
              {currentStep === 2 && "Tell us about your driving experience"}
              {currentStep === 3 && "Vehicle details and documentation"}
              {currentStep === 4 && "Your application has been submitted"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            {currentStep < 4 && (
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={submitApplication.isPending}
                >
                  {submitApplication.isPending ? "Submitting..." : currentStep === 3 ? "Submit Application" : "Next"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}