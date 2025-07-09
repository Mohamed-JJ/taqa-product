import {
  Filter,
  FileText,
  Settings,
  Activity,
  Clock,
  AlertTriangle,
  Users,
  Power,
  Calendar,
  Hash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AnomalyFiltersSectionProps {
  // Filter states
  descriptionFilter: string;
  equipmentFilter: string;
  systemFilter: string;
  statusFilter: string;
  criticalityFilter: string;
  serviceFilter: string;
  shutdownFilter: string;
  detectionDate: Date | undefined;

  // Filter handlers
  setDescriptionFilter: (value: string) => void;
  setEquipmentFilter: (value: string) => void;
  setSystemFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setCriticalityFilter: (value: string) => void;
  setServiceFilter: (value: string) => void;
  setShutdownFilter: (value: string) => void;
  setDetectionDate: (date: Date | undefined) => void;

  // UI states and handlers
  isFiltersExpanded: boolean;
  toggleFilters: () => void;
  clearAllFilters: () => void;
  getActiveFilterCount: () => number;

  // Translations
  t: any;
  listT: any;
  anomalyT: any;
  commonT: any;

  // Utilities
  formatDate: (date: string) => string;
}

export const AnomalyFiltersSection = ({
  // Filter states
  descriptionFilter,
  equipmentFilter,
  systemFilter,
  statusFilter,
  criticalityFilter,
  serviceFilter,
  shutdownFilter,
  detectionDate,

  // Filter handlers
  setDescriptionFilter,
  setEquipmentFilter,
  setSystemFilter,
  setStatusFilter,
  setCriticalityFilter,
  setServiceFilter,
  setShutdownFilter,
  setDetectionDate,

  // UI states and handlers
  isFiltersExpanded,
  toggleFilters,
  clearAllFilters,
  getActiveFilterCount,

  // Translations
  t,
  listT,
  anomalyT,
  commonT,

  // Utilities
  formatDate,
}: AnomalyFiltersSectionProps) => {
  return (
    <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-taqa-primary/5 to-taqa-blue/5 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="font-heading text-xl flex items-center gap-3">
              <div className="p-2 bg-taqa-primary/20 rounded-lg">
                <Filter className="h-5 w-5 text-taqa-primary" />
              </div>
              {t("anomalyList.searchAndFilters")}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2 ml-11">
              {listT.findAndFilterDescription}
              {!isFiltersExpanded && getActiveFilterCount() > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-taqa-primary/20 text-taqa-primary font-medium">
                  {getActiveFilterCount()} {getActiveFilterCount() === 1 ? listT.activeFilter : listT.activeFilters}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-full">
              <Hash className="h-3 w-3" />
              {listT.advancedFiltering}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFilters}
              className="p-3 h-auto bg-[#003D55] hover:bg-[#002a3d] border border-white/20 hover:border-white/40 rounded-lg transition-all duration-200 group"
            >
              {isFiltersExpanded ? (
                <ChevronUp className="h-6 w-6 text-white group-hover:text-white group-hover:scale-110 transition-all duration-200" />
              ) : (
                <ChevronDown className="h-6 w-6 text-white group-hover:text-white group-hover:scale-110 transition-all duration-200" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isFiltersExpanded && (
        <CardContent className="p-6 animate-in slide-in-from-top-1 duration-300">
          <div className="space-y-8">
            {/* Text Filters Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-green-500/20 rounded-md">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{listT.contentFilters}</h3>
                <div className="flex-1 h-px bg-border ml-2"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description-filter" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    {anomalyT.description}
                  </Label>
                  <div className="relative">
                    <Input
                      id="description-filter"
                      placeholder={listT.filterByDescriptionPlaceholder}
                      value={descriptionFilter}
                      onChange={(e) => setDescriptionFilter(e.target.value)}
                      className="h-11 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment-filter" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                    {anomalyT.equipment}
                  </Label>
                  <div className="relative">
                    <Input
                      id="equipment-filter"
                      placeholder={listT.filterByEquipmentPlaceholder}
                      value={equipmentFilter}
                      onChange={(e) => setEquipmentFilter(e.target.value)}
                      className="h-11 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-filter" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                    System
                  </Label>
                  <div className="relative">
                    <Input
                      id="system-filter"
                      placeholder={listT.filterBySystemPlaceholder}
                      value={systemFilter}
                      onChange={(e) => setSystemFilter(e.target.value)}
                      className="h-11 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown Filters Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-purple-500/20 rounded-md">
                  <Filter className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{listT.categoryFilters}</h3>
                <div className="flex-1 h-px bg-border ml-2"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status-filter" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {anomalyT.status}
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200">
                      <SelectValue placeholder={anomalyT.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("anomalyList.allStatus")}</SelectItem>
                      <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                      <SelectItem value="TREATED">Traitée</SelectItem>
                      <SelectItem value="CLOSED">Clôturée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="criticality-filter" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
                    {anomalyT.criticality}
                  </Label>
                  <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
                    <SelectTrigger className="h-11 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200">
                      <SelectValue placeholder={anomalyT.criticality} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("anomalyList.allLevels")}</SelectItem>
                      <SelectItem value="critical">{t("anomalyList.criticalHigh")}</SelectItem>
                      <SelectItem value="high">{t("anomalyList.high")}</SelectItem>
                      <SelectItem value="medium">{t("anomalyList.medium")}</SelectItem>
                      <SelectItem value="low">{t("anomalyList.low")}</SelectItem>
                      <SelectItem value="very-low">{t("anomalyList.veryLow")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-filter" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    Service
                  </Label>
                  <Select value={serviceFilter} onValueChange={setServiceFilter}>
                    <SelectTrigger className="h-11 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200">
                      <SelectValue placeholder={listT.selectService} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{listT.allServices}</SelectItem>
                      <SelectItem value="MC">MC</SelectItem>
                      <SelectItem value="MM">MM</SelectItem>
                      <SelectItem value="MD">MD</SelectItem>
                      <SelectItem value="CT">CT</SelectItem>
                      <SelectItem value="EL">EL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shutdown-filter" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Power className="h-3.5 w-3.5 text-muted-foreground" />
                    {listT.systemShutdown}
                  </Label>
                  <Select value={shutdownFilter} onValueChange={setShutdownFilter}>
                    <SelectTrigger className="h-11 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200">
                      <SelectValue placeholder={listT.selectShutdown} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{listT.allShutdownOptions}</SelectItem>
                      <SelectItem value="true">{commonT.yes}</SelectItem>
                      <SelectItem value="false">{commonT.no}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Date & Actions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-orange-500/20 rounded-md">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{listT.dateAndActions}</h3>
                <div className="flex-1 h-px bg-border ml-2"></div>
              </div>
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1 w-full space-y-2">
                  <Label htmlFor="detection-date" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {anomalyT.detectionDate}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-11 justify-start text-left font-normal bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200",
                          !detectionDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-3 h-4 w-4" />
                        {detectionDate ? (
                          formatDate(detectionDate.toISOString())
                        ) : (
                          <span>{listT.selectDetectionDate}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DatePicker
                        mode="single"
                        selected={detectionDate}
                        onSelect={setDetectionDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="h-11 px-6 bg-white border-2 border-gray-200 text-muted-foreground hover:bg-gray-50 hover:border-gray-300 hover:text-foreground rounded-lg shadow-sm transition-all duration-200"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {listT.clearFilters}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}; 