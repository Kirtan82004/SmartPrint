"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Printer, Usb, Wifi, Network, Settings, CheckCircle, AlertTriangle, Monitor, HelpCircle } from "lucide-react"

export function PrinterSetupGuide() {
  const [currentStep, setCurrentStep] = useState(1)
  const [connectionType, setConnectionType] = useState<"usb" | "wifi" | "network" | null>(null)

  const connectionSteps = {
    usb: [
      {
        title: "USB Cable Connect करें",
        description: "Printer को computer से USB cable के साथ connect करें",
        icon: <Usb className="h-5 w-5" />,
        details: [
          "Printer का power on करें",
          "USB cable को printer और computer दोनों में properly connect करें",
          "Windows automatically driver install करेगा",
        ],
      },
      {
        title: "Driver Installation",
        description: "Printer driver install होने का wait करें",
        icon: <Settings className="h-5 w-5" />,
        details: [
          "Windows Update से automatic driver download होगा",
          "अगर automatic नहीं हुआ तो manufacturer website से driver download करें",
          "Driver installation complete होने तक wait करें",
        ],
      },
      {
        title: "Test Print",
        description: "Printer working check करें",
        icon: <CheckCircle className="h-5 w-5" />,
        details: [
          "Windows Settings &gt; Printers &amp; Scanners में जाएं",
          "अपना printer select करें",
          "Test page print करें",
        ],
      },
    ],
    wifi: [
      {
        title: "WiFi Setup Mode",
        description: "Printer को WiFi setup mode में डालें",
        icon: <Wifi className="h-5 w-5" />,
        details: [
          "Printer के WiFi button को press करें",
          "या Settings menu से WiFi setup select करें",
          "Printer का WiFi light blink होना चाहिए",
        ],
      },
      {
        title: "Network Connection",
        description: "Printer को अपने WiFi network से connect करें",
        icon: <Network className="h-5 w-5" />,
        details: [
          "Computer/phone से printer का WiFi network select करें",
          "Printer के display पर अपना home WiFi network select करें",
          "WiFi password enter करें",
        ],
      },
      {
        title: "Add to Computer",
        description: "Computer में printer add करें",
        icon: <Monitor className="h-5 w-5" />,
        details: [
          "Windows Settings &gt; Printers &amp; Scanners खोलें",
          "'Add printer or scanner' click करें",
          "WiFi printer automatically detect होगा",
        ],
      },
    ],
    network: [
      {
        title: "Ethernet Connection",
        description: "Printer को network cable से connect करें",
        icon: <Network className="h-5 w-5" />,
        details: [
          "Ethernet cable को printer और router में connect करें",
          "Printer का network light on होना चाहिए",
          "Printer automatically IP address get करेगा",
        ],
      },
      {
        title: "IP Address Find करें",
        description: "Printer का network IP address find करें",
        icon: <Settings className="h-5 w-5" />,
        details: [
          "Printer के menu से Network Settings खोलें",
          "IP Address note करें (जैसे: 192.168.1.100)",
          "या configuration page print करें",
        ],
      },
      {
        title: "Network Printer Add करें",
        description: "Computer में network printer add करें",
        icon: <CheckCircle className="h-5 w-5" />,
        details: [
          "Windows Settings &gt; Printers &amp; Scanners",
          "'Add printer or scanner' &gt; 'The printer that I want isn't listed'",
          "IP address enter करके printer add करें",
        ],
      },
    ],
  }

  const troubleshootingTips = [
    {
      problem: "Printer detect नहीं हो रहा",
      solutions: [
        "Printer का power on check करें",
        "USB cable properly connected है check करें",
        "Different USB port try करें",
        "Printer driver manually install करें",
      ],
    },
    {
      problem: "WiFi connection fail हो रहा",
      solutions: [
        "WiFi password correct है check करें",
        "Printer और router same network पर हैं check करें",
        "Router restart करें",
        "Printer का WiFi reset करें",
      ],
    },
    {
      problem: "Print job stuck हो रहा",
      solutions: ["Print queue clear करें", "Printer restart करें", "Paper jam check करें", "Ink/toner level check करें"],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Connection Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Printer Connection Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={connectionType === "usb" ? "default" : "outline"}
              className="h-20 flex-col gap-2"
              onClick={() => setConnectionType("usb")}
            >
              <Usb className="h-6 w-6" />
              <span>USB Connection</span>
              <span className="text-xs opacity-70">Direct cable connection</span>
            </Button>

            <Button
              variant={connectionType === "wifi" ? "default" : "outline"}
              className="h-20 flex-col gap-2"
              onClick={() => setConnectionType("wifi")}
            >
              <Wifi className="h-6 w-6" />
              <span>WiFi Connection</span>
              <span className="text-xs opacity-70">Wireless network</span>
            </Button>

            <Button
              variant={connectionType === "network" ? "default" : "outline"}
              className="h-20 flex-col gap-2"
              onClick={() => setConnectionType("network")}
            >
              <Network className="h-6 w-6" />
              <span>Network/Ethernet</span>
              <span className="text-xs opacity-70">Wired network</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      {connectionType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {connectionType === "usb" && <Usb className="h-5 w-5" />}
              {connectionType === "wifi" && <Wifi className="h-5 w-5" />}
              {connectionType === "network" && <Network className="h-5 w-5" />}
              {connectionType.toUpperCase()} Connection Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {connectionSteps[connectionType].map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep > index + 1
                          ? "bg-green-100 text-green-600"
                          : currentStep === index + 1
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {currentStep > index + 1 ? <CheckCircle className="h-5 w-5" /> : step.icon}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>

                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-gray-500 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>

                    {currentStep === index + 1 && (
                      <Button size="sm" className="mt-3" onClick={() => setCurrentStep(currentStep + 1)}>
                        Next Step
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Browser Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Browser Settings & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Browser को printer access allow करना होगा printing के लिए
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="chrome" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chrome">Chrome</TabsTrigger>
              <TabsTrigger value="firefox">Firefox</TabsTrigger>
              <TabsTrigger value="safari">Safari</TabsTrigger>
            </TabsList>

            <TabsContent value="chrome" className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Chrome Browser Settings:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Chrome Settings (⚙️) खोलें</li>
                  <li>Privacy and Security &gt; Site Settings जाएं</li>
                  <li>Additional permissions &gt; Printers select करें</li>
                  <li>SmartPrint website को "Allow" करें</li>
                  <li>Page refresh करें</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="firefox" className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Firefox Browser Settings:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Firefox Settings खोलें</li>
                  <li>Privacy &amp; Security section में जाएं</li>
                  <li>Permissions &gt; Printers find करें</li>
                  <li>SmartPrint को allow करें</li>
                  <li>Browser restart करें</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="safari" className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Safari Browser Settings:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Safari &gt; Preferences खोलें</li>
                  <li>Websites tab select करें</li>
                  <li>Printers section find करें</li>
                  <li>SmartPrint website allow करें</li>
                  <li>Page reload करें</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {troubleshootingTips.map((tip, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {tip.problem}
                </h4>
                <div className="space-y-1">
                  {tip.solutions.map((solution, solutionIndex) => (
                    <div key={solutionIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {solution}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Quick Printer Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Test Your Setup:</h4>
            <p className="text-sm text-green-700 mb-3">
              Printer connect करने के बाद यह test करें कि सब कुछ properly work कर रहा है
            </p>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                const testWindow = window.open("", "_blank")
                if (testWindow) {
                  testWindow.document.write(`
                    <html>
                      <head><title>Printer Test</title></head>
                      <body style="font-family: Arial; padding: 20px;">
                        <h1>🖨️ Printer Connection Test</h1>
                        <p>Date: ${new Date().toLocaleString()}</p>
                        <p>If you can see this page and print it successfully, your printer is connected properly!</p>
                        <div style="margin: 20px 0; padding: 10px; border: 1px solid #ccc;">
                          <h3>Test Elements:</h3>
                          <p>✅ Text printing</p>
                          <p>✅ Date/time: ${new Date().toLocaleString()}</p>
                          <p>✅ Basic formatting</p>
                        </div>
                      </body>
                    </html>
                  `)
                  testWindow.document.close()
                  testWindow.print()
                }
              }}
            >
              <Printer className="h-4 w-4 mr-2" />
              Test Print Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
