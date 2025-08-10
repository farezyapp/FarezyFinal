import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Code, Globe, Shield } from 'lucide-react';

export default function LicensesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Licenses & Attributions</h1>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Open Source & Third-Party Licenses
            </CardTitle>
            <CardDescription>
              Last updated: January 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Farezy is built using various open-source libraries and third-party services. We acknowledge and respect the licenses of all components used in our platform.
            </p>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {/* React and Core Libraries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Code className="h-5 w-5 text-orange-600" />
                React and Core Libraries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">React</h3>
                  <p className="text-blue-800 text-sm mb-2">
                    Copyright (c) Facebook, Inc. and its affiliates.
                  </p>
                  <p className="text-blue-700 text-sm">
                    Licensed under the MIT License. React is a JavaScript library for building user interfaces.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">TypeScript</h3>
                  <p className="text-green-800 text-sm mb-2">
                    Copyright (c) Microsoft Corporation.
                  </p>
                  <p className="text-green-700 text-sm">
                    Licensed under the Apache License 2.0. TypeScript is a typed superset of JavaScript.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Vite</h3>
                  <p className="text-purple-800 text-sm mb-2">
                    Copyright (c) 2019-present, Yuxi (Evan) You and Vite contributors.
                  </p>
                  <p className="text-purple-700 text-sm">
                    Licensed under the MIT License. Vite is a build tool that provides fast development.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* UI Libraries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">UI Libraries and Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Copyright (c) Tailwind Labs, Inc.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Licensed under the MIT License. A utility-first CSS framework for rapidly building custom designs.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Radix UI</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Copyright (c) 2022 WorkOS
                  </p>
                  <p className="text-gray-600 text-sm">
                    Licensed under the MIT License. Low-level UI primitives with a focus on accessibility.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Lucide React</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Copyright (c) 2022 Lucide Contributors
                  </p>
                  <p className="text-gray-600 text-sm">
                    Licensed under the ISC License. Beautiful & consistent icon toolkit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backend Libraries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Backend Libraries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="font-semibold text-indigo-900 mb-2">Node.js</h3>
                  <p className="text-indigo-800 text-sm mb-2">
                    Copyright Node.js contributors. All rights reserved.
                  </p>
                  <p className="text-indigo-700 text-sm">
                    Licensed under the MIT License. Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
                  </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="font-semibold text-indigo-900 mb-2">Express.js</h3>
                  <p className="text-indigo-800 text-sm mb-2">
                    Copyright (c) 2009-2014 TJ Holowaychuk and contributors
                  </p>
                  <p className="text-indigo-700 text-sm">
                    Licensed under the MIT License. Fast, unopinionated, minimalist web framework for Node.js.
                  </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="font-semibold text-indigo-900 mb-2">Drizzle ORM</h3>
                  <p className="text-indigo-800 text-sm mb-2">
                    Copyright (c) 2022 Drizzle Contributors
                  </p>
                  <p className="text-indigo-700 text-sm">
                    Licensed under the Apache License 2.0. TypeScript ORM for SQL databases.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-600" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">Google Maps API</h3>
                  <p className="text-red-800 text-sm mb-2">
                    Copyright (c) Google LLC
                  </p>
                  <p className="text-red-700 text-sm">
                    Subject to Google Maps Platform Terms of Service. Used for location services, geocoding, and mapping functionality.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">PostgreSQL</h3>
                  <p className="text-red-800 text-sm mb-2">
                    Copyright (c) 1996-2023, PostgreSQL Global Development Group
                  </p>
                  <p className="text-red-700 text-sm">
                    Licensed under the PostgreSQL License. Object-relational database system.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">SendGrid</h3>
                  <p className="text-red-800 text-sm mb-2">
                    Copyright (c) SendGrid, Inc.
                  </p>
                  <p className="text-red-700 text-sm">
                    Subject to SendGrid Terms of Service. Email delivery and communication service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Open Source License Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">License Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">MIT License</h3>
                  <p className="text-gray-700 text-sm">
                    A permissive license that is short and to the point. It lets people do anything they want with the code as long as they provide attribution and don't hold the author liable.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Apache License 2.0</h3>
                  <p className="text-gray-700 text-sm">
                    A permissive license that also provides an express grant of patent rights from contributors. It requires preservation of copyright and license notices.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">ISC License</h3>
                  <p className="text-gray-700 text-sm">
                    A permissive license similar to BSD and MIT licenses. It is functionally equivalent to the simplified BSD license.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">PostgreSQL License</h3>
                  <p className="text-gray-700 text-sm">
                    A liberal Open Source license, similar to the BSD or MIT licenses. It allows for proprietary use and modification.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complete Dependencies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Complete Dependencies List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                For a complete list of all dependencies and their licenses, please refer to:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="text-gray-700 space-y-1">
                  <li>• <code className="bg-gray-200 px-2 py-1 rounded">package.json</code> - Production dependencies</li>
                  <li>• <code className="bg-gray-200 px-2 py-1 rounded">package-lock.json</code> - Complete dependency tree</li>
                  <li>• Our GitHub repository's dependency graph</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Attribution Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Attribution Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We comply with all attribution requirements from our dependencies. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Preserving copyright notices in source code</li>
                <li>Including license texts where required</li>
                <li>Providing attribution in our documentation</li>
                <li>Maintaining license compliance in distributed versions</li>
              </ul>
            </CardContent>
          </Card>

          {/* Farezy License */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Farezy Platform License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Farezy platform itself is proprietary software owned by Farezy Limited. While we use open-source components, the overall platform, including its design, algorithms, and business logic, is protected by copyright and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Use of the Farezy platform is subject to our Terms of Service and Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Reporting Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">License Compliance & Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you believe we have not properly attributed a library or service, or if you have questions about license compliance, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@farezy.co.uk<br/>
                  <strong>Subject:</strong> License Compliance Inquiry<br/>
                  <strong>Address:</strong> Farezy Limited, London, United Kingdom
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We take license compliance seriously and will address any issues promptly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}