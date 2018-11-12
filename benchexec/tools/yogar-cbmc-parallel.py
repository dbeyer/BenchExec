"""
BenchExec is a framework for reliable benchmarking.
This file is part of BenchExec.
Copyright (C) 2007-2015  Dirk Beyer
All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

import benchexec.util as util
yogar_cbmc = __import__("benchexec.tools.yogar-cbmc", fromlist=["Tool"])

class Tool(yogar_cbmc.Tool):

    REQUIRED_PATHS = [
                  "yogar-cbmc"
                  ]

    def executable(self):
        return util.find_executable('yogar-cbmc-parallel')

    def name(self):
        return 'Yogar-CBMC-Parallel'
        
    def version(self, executable):
		return self._version_from_tool(executable)

    def cmdline(self, executable, options, tasks, propertyfile, rlimits):
        return [executable] + options + tasks
