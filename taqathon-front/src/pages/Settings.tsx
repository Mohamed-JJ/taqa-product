import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSettingsTranslations } from "@/i18n/hooks/useTranslations";

const Settings = () => {
  const settingsT = useSettingsTranslations();
  
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phoneNumber: "",
    department: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDetails = () => {
    // Here you would typically make an API call to update the user details
    toast.success(settingsT.userDetailsUpdated);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {settingsT.userDetails}
          </CardTitle>
          <CardDescription>
            {settingsT.updatePersonalInformation}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{settingsT.firstName}</Label>
              <Input 
                id="firstName"
                value={userDetails.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder={settingsT.enterFirstName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{settingsT.lastName}</Label>
              <Input 
                id="lastName"
                value={userDetails.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder={settingsT.enterLastName}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{settingsT.emailAddress}</Label>
            <Input 
              id="email"
              type="email"
              value={userDetails.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={settingsT.enterEmailAddress}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{settingsT.phoneNumber}</Label>
            <Input 
              id="phoneNumber"
              value={userDetails.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder={settingsT.enterPhoneNumber}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">{settingsT.role}</Label>
              <Select 
                value={userDetails.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={settingsT.selectRole} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{settingsT.administrator}</SelectItem>
                  <SelectItem value="engineer">{settingsT.engineer}</SelectItem>
                  <SelectItem value="technician">{settingsT.technician}</SelectItem>
                  <SelectItem value="manager">{settingsT.manager}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">{settingsT.department}</Label>
              <Select
                value={userDetails.department}
                onValueChange={(value) => handleInputChange("department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={settingsT.selectDepartment} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">{settingsT.it}</SelectItem>
                  <SelectItem value="hr">{settingsT.hr}</SelectItem>
                  <SelectItem value="engineering">{settingsT.engineering}</SelectItem>
                  <SelectItem value="operations">{settingsT.operations}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveDetails}>
              <Save className="h-4 w-4 mr-2" />
              {settingsT.saveChanges}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;