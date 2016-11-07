
import logging
import xml.etree.ElementTree as ET

import benchexec.util as util
import benchexec.tools.template
import benchexec.result as result

class Tool(benchexec.tools.template.BaseTool):
    """
	veriabs for SV-COMP 2017
    """
    def executable(self):
        return util.find_executable('veriabs')


    def version(self, executable):
        return " Version 0.001 Alpha"


    def name(self):
        return 'VeriAbs SV-COMP 2017'


    def cmdline(self, executable, options, tasks, propertyfile, rlimits):
        if propertyfile:
            options += ['--property-file', propertyfile]
        self.options = options
        return [executable] + options + tasks




    def determine_result(self, returncode, returnsignal, output, isTimeout):
        lines = " ".join(output[-10:])
        print(lines)

        if isTimeout:
            return 'TIMEOUT' 

        if "INVALID-POINTER" in lines or "DYNAMIC_OBJECT" in lines or "dereference failure" in lines:
            return result.RESULT_FALSE_DEREF		
        elif "SUCCESS" in lines:
            return result.RESULT_TRUE_PROP
        elif "FAILED" in lines:
            return result.RESULT_FALSE_REACH
        elif "OUTOFMEMORY" in lines:
            return 'OUT OF MEMORY'
        elif "TIMEOUT" in lines:
            return "TIMEOUT"
        elif "NOT SUPPORTED" in lines or "UNKNOWN" in lines:
            return result.RESULT_UNKNOWN
        else:
            return result.RESULT_ERROR

