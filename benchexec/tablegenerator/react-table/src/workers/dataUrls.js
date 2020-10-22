// This file is part of BenchExec, a framework for reliable benchmarking:
// https://github.com/sosy-lab/benchexec
//
// SPDX-FileCopyrightText: 2019-2020 Dirk Beyer <https://www.sosy-lab.org>
//
// SPDX-License-Identifier: Apache-2.0

const stats =
  "data:text/plain;base64,Ly8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgQmVuY2hFeGVjLCBhIGZyYW1ld29yayBmb3IgcmVsaWFibGUgYmVuY2htYXJraW5nOgovLyBodHRwczovL2dpdGh1Yi5jb20vc29zeS1sYWIvYmVuY2hleGVjCi8vCi8vIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMTktMjAyMCBEaXJrIEJleWVyIDxodHRwczovL3d3dy5zb3N5LWxhYi5vcmc+Ci8vCi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wCgpjb25zdCBtYXliZUFkZCA9IChhLCBiLCB0eXBlKSA9PiB7CiAgaWYgKE51bWJlcihiKSkgewogICAgcmV0dXJuIGEgKyBOdW1iZXIoYik7CiAgfQogIGlmICh0eXBlID09PSAic3RhdHVzIikgewogICAgcmV0dXJuIGEgKyAxOwogIH0KICByZXR1cm4gYTsKfTsKCmNvbnN0IGNhbGN1bGF0ZU1lZGlhbiA9ICh2YWx1ZXMsIGFsbEl0ZW1zKSA9PiB7CiAgY29uc3QgbnVtTWluID0gTnVtYmVyKHZhbHVlcy5taW4pOwogIGNvbnN0IG51bU1heCA9IE51bWJlcih2YWx1ZXMubWF4KTsKICBpZiAobnVtTWluID09PSAtSW5maW5pdHkgJiYgbnVtTWF4ID09PSBJbmZpbml0eSkgewogICAgdmFsdWVzLm1lZGlhbiA9ICJOYU4iOwogIH0gZWxzZSBpZiAobnVtTWluID09PSAtSW5maW5pdHkpIHsKICAgIHZhbHVlcy5tZWRpYW4gPSAiLUluZmluaXR5IjsKICB9IGVsc2UgaWYgKG51bU1heCA9PT0gSW5maW5pdHkpIHsKICAgIHZhbHVlcy5tZWRpYW4gPSAiSW5maW5pdHkiOwogIH0gZWxzZSB7CiAgICBpZiAoYWxsSXRlbXMubGVuZ3RoICUgMiA9PT0gMCkgewogICAgICBjb25zdCBpZHggPSBhbGxJdGVtcy5sZW5ndGggLyAyOwogICAgICB2YWx1ZXMubWVkaWFuID0KICAgICAgICAoTnVtYmVyKGFsbEl0ZW1zW2lkeCAtIDFdLmNvbHVtbikgKyBOdW1iZXIoYWxsSXRlbXNbaWR4XS5jb2x1bW4pKSAvIDIuMDsKICAgIH0gZWxzZSB7CiAgICAgIHZhbHVlcy5tZWRpYW4gPSBOdW1iZXIoCiAgICAgICAgYWxsSXRlbXNbTWF0aC5mbG9vcihhbGxJdGVtcy5sZW5ndGggLyAyLjApXS5jb2x1bW4sCiAgICAgICk7CiAgICB9CiAgfQp9OwoKY29uc3QgcGFyc2VQeXRob25JbmZpbml0eVZhbHVlcyA9IChkYXRhKSA9PgogIGRhdGEubWFwKChpdGVtKSA9PiB7CiAgICBpZiAoaXRlbS5jb2x1bW5UeXBlID09PSAic3RhdHVzIiB8fCAhaXRlbS5jb2x1bW4uZW5kc1dpdGgoIkluZiIpKSB7CiAgICAgIHJldHVybiBpdGVtOwogICAgfQogICAgLy8gV2UgaGF2ZSBhIHB5dGhvbiBJbmZpbml0eSB2YWx1ZSB0aGF0IHdlIHdhbnQgdG8gdHJhbnNmZXIgdG8gYSBzdHJpbmcKICAgIC8vIHRoYXQgY2FuIGJlIGludGVycHJldGVkIGFzIGEgSmF2YVNjcmlwdCBJbmZpbml0eSB2YWx1ZQogICAgaXRlbS5jb2x1bW4gPSBpdGVtLmNvbHVtbi5yZXBsYWNlKCJJbmYiLCAiSW5maW5pdHkiKTsKICAgIHJldHVybiBpdGVtOwogIH0pOwoKY29uc3Qgc2hvdWxkU2tpcEJ1Y2tldCA9IChidWNrZXRNZXRhLCBrZXkpID0+IHsKICBpZiAoYnVja2V0TWV0YVtrZXldICYmIGJ1Y2tldE1ldGFba2V5XS5oYXNOYU4pIHsKICAgIHJldHVybiB0cnVlOwogIH0KICByZXR1cm4gZmFsc2U7Cn07Cgpvbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkgewogIGNvbnN0IHsgZGF0YSwgdHJhbnNhY3Rpb24gfSA9IGUuZGF0YTsKCiAgY29uc3QgZGVmYXVsdE9iaiA9IHsKICAgIHN1bTogMCwKICAgIGF2ZzogMCwKICAgIG1heDogMCwKICAgIG1lZGlhbjogMCwKICAgIG1pbjogSW5maW5pdHksCiAgICBzdGRldjogMCwKICAgIHZhcmlhbmNlOiAwLAogIH07CgogIGNvbnN0IG5hbk9iaiA9IHsgLi4uZGVmYXVsdE9iaiB9OwogIGZvciAoY29uc3Qgb2JqS2V5IG9mIE9iamVjdC5rZXlzKG5hbk9iaikpIHsKICAgIG5hbk9ialtvYmpLZXldID0gIk5hTiI7CiAgfQoKICBsZXQgY29weSA9IFsuLi5kYXRhXS5maWx0ZXIoCiAgICAoaSkgPT4gaSAmJiBpLmNvbHVtbiAhPT0gdW5kZWZpbmVkICYmIGkuY29sdW1uICE9PSBudWxsLAogICk7CiAgY29weSA9IHBhcnNlUHl0aG9uSW5maW5pdHlWYWx1ZXMoY29weSk7CgogIGlmIChjb3B5Lmxlbmd0aCA9PT0gMCkgewogICAgcG9zdFJlc3VsdCh7IHRvdGFsOiB1bmRlZmluZWQgfSwgdHJhbnNhY3Rpb24pOwogICAgcmV0dXJuOwogIH0KCiAgY29weS5zb3J0KChhLCBiKSA9PiBhLmNvbHVtbiAtIGIuY29sdW1uKTsKCiAgY29uc3QgYnVja2V0cyA9IHt9OwogIGNvbnN0IGJ1Y2tldE1ldGEgPSB7fTsgLy8gdXNlZCB0byBzdG9yZSB2YXJpb3VzIHByb3BlcnRpZXMgb2YgYnVja2V0cwoKICBsZXQgdG90YWwgPSB7IC4uLmRlZmF1bHRPYmosIGl0ZW1zOiBbXSB9OwoKICB0b3RhbC5tYXggPSBjb3B5W2NvcHkubGVuZ3RoIC0gMV0uY29sdW1uOwogIHRvdGFsLm1pbiA9IGNvcHlbMF0uY29sdW1uOwoKICBjb25zdCB0b3RhbE1ldGEgPSB7CiAgICBoYXNOYU46IGNvcHkuc29tZSgoaXRlbSkgPT4gewogICAgICBpZiAoaXRlbS5jb2x1bW5UeXBlICE9PSAic3RhdHVzIiAmJiBpc05hTihpdGVtLmNvbHVtbikpIHsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgfQogICAgICByZXR1cm4gZmFsc2U7CiAgICB9KSwKICAgIGhhc1Bvc0luZjogdG90YWwubWF4ID09PSBJbmZpbml0eSwKICAgIGhhc05lZ0luZjogdG90YWwubWluID09PSAtSW5maW5pdHksCiAgfTsKCiAgLy8gQnVja2V0IHNldHVwIHdpdGggc3VtIGFuZCBtaW4vbWF4CiAgZm9yIChjb25zdCBpdGVtIG9mIGNvcHkpIHsKICAgIGNvbnN0IGtleSA9IGAke2l0ZW0uY2F0ZWdvcnlUeXBlfS0ke2l0ZW0ucmVzdWx0VHlwZX1gOwogICAgY29uc3QgdG90YWxLZXkgPSBgJHtpdGVtLmNhdGVnb3J5VHlwZX0tdG90YWxgOwogICAgY29uc3QgeyBjb2x1bW5UeXBlOiB0eXBlLCBjb2x1bW4sIGNvbHVtblRpdGxlOiB0aXRsZSB9ID0gaXRlbTsKICAgIGNvbnN0IGJ1Y2tldCA9IGJ1Y2tldHNba2V5XSB8fCB7CiAgICAgIC4uLmRlZmF1bHRPYmosCiAgICAgIHRpdGxlLAogICAgICBpdGVtczogW10sCiAgICB9OwoKICAgIGNvbnN0IHN1YlRvdGFsQnVja2V0ID0gYnVja2V0c1t0b3RhbEtleV0gfHwgewogICAgICAuLi5kZWZhdWx0T2JqLAogICAgICB0aXRsZSwKICAgICAgaXRlbXM6IFtdLAogICAgfTsKCiAgICBjb25zdCBpdGVtSXNOYU4gPSB0eXBlICE9PSAic3RhdHVzIiAmJiBpc05hTihjb2x1bW4pOwoKICAgIC8vIGlmIG9uZSBpdGVtIGlzIE5hTiB3ZSBzdG9yZSB0aGF0IGluZm8gc28gd2UgY2FuIGRlZmF1bHQgYWxsCiAgICAvLyBjYWxjdWxhdGVkIHZhbHVlcyBmb3IgdGhpcyBidWNrZXQgdG8gTmFOCiAgICBpZiAoaXRlbUlzTmFOKSB7CiAgICAgIGJ1Y2tldE1ldGFba2V5XSA9IHsgaGFzTmFOOiB0cnVlIH07CiAgICAgIGJ1Y2tldE1ldGFbdG90YWxLZXldID0geyBoYXNOYU46IHRydWUgfTsKCiAgICAgIC8vIHNldCBhbGwgdmFsdWVzIGZvciB0aGlzIGJ1Y2tldCB0byBOYU4KICAgICAgYnVja2V0c1trZXldID0geyAuLi5uYW5PYmosIHRpdGxlIH07CiAgICAgIGJ1Y2tldHNbdG90YWxLZXldID0geyAuLi5uYW5PYmosIHRpdGxlIH07CiAgICAgIGNvbnRpbnVlOwogICAgfQoKICAgIC8vIHdlIGNoZWNrIGlmIHdlIHNob3VsZCBza2lwIGNhbGN1bGF0aW9uIGZvciB0aGVzZSBidWNrZXRzCiAgICBjb25zdCBza2lwQnVja2V0ID0gc2hvdWxkU2tpcEJ1Y2tldChidWNrZXRNZXRhLCBrZXkpOwogICAgY29uc3Qgc2tpcFN1YlRvdGFsID0gc2hvdWxkU2tpcEJ1Y2tldChidWNrZXRNZXRhLCB0b3RhbEtleSk7CgogICAgaWYgKCFza2lwQnVja2V0KSB7CiAgICAgIGJ1Y2tldC5zdW0gPSBtYXliZUFkZChidWNrZXQuc3VtLCBjb2x1bW4sIHR5cGUpOwogICAgfQogICAgaWYgKCFza2lwU3ViVG90YWwpIHsKICAgICAgc3ViVG90YWxCdWNrZXQuc3VtID0gbWF5YmVBZGQoc3ViVG90YWxCdWNrZXQuc3VtLCBjb2x1bW4sIHR5cGUpOwogICAgfQogICAgaWYgKCF0b3RhbE1ldGEuaGFzTmFOKSB7CiAgICAgIHRvdGFsLnN1bSA9IG1heWJlQWRkKHRvdGFsLnN1bSwgY29sdW1uLCB0eXBlKTsKICAgIH0KCiAgICBpZiAoIWlzTmFOKE51bWJlcihjb2x1bW4pKSkgewogICAgICBjb25zdCBudW1Db2wgPSBOdW1iZXIoY29sdW1uKTsKICAgICAgaWYgKCFza2lwQnVja2V0KSB7CiAgICAgICAgYnVja2V0Lm1heCA9IE1hdGgubWF4KGJ1Y2tldC5tYXgsIG51bUNvbCk7CiAgICAgICAgYnVja2V0Lm1pbiA9IE1hdGgubWluKGJ1Y2tldC5taW4sIG51bUNvbCk7CiAgICAgIH0KICAgICAgaWYgKCFza2lwU3ViVG90YWwpIHsKICAgICAgICBzdWJUb3RhbEJ1Y2tldC5tYXggPSBNYXRoLm1heChzdWJUb3RhbEJ1Y2tldC5tYXgsIG51bUNvbCk7CiAgICAgICAgc3ViVG90YWxCdWNrZXQubWluID0gTWF0aC5taW4oc3ViVG90YWxCdWNrZXQubWluLCBudW1Db2wpOwogICAgICB9CiAgICB9CiAgICBpZiAoIXNraXBCdWNrZXQpIHsKICAgICAgdHJ5IHsKICAgICAgICBidWNrZXQuaXRlbXMucHVzaChpdGVtKTsKICAgICAgfSBjYXRjaCAoZSkgewogICAgICAgIGNvbnNvbGUuZSh7IGJ1Y2tldCwgYnVja2V0TWV0YSwga2V5IH0pOwogICAgICB9CiAgICB9CiAgICBpZiAoIXNraXBTdWJUb3RhbCkgewogICAgICB0cnkgewogICAgICAgIHN1YlRvdGFsQnVja2V0Lml0ZW1zLnB1c2goaXRlbSk7CiAgICAgIH0gY2F0Y2ggKGUpIHsKICAgICAgICBjb25zb2xlLmUoeyBzdWJUb3RhbEJ1Y2tldCwgYnVja2V0TWV0YSwgdG90YWxLZXkgfSk7CiAgICAgIH0KICAgIH0KCiAgICBidWNrZXRzW2tleV0gPSBidWNrZXQ7CiAgICBidWNrZXRzW3RvdGFsS2V5XSA9IHN1YlRvdGFsQnVja2V0OwogIH0KCiAgZm9yIChjb25zdCBbYnVja2V0LCB2YWx1ZXNdIG9mIE9iamVjdC5lbnRyaWVzKGJ1Y2tldHMpKSB7CiAgICBpZiAoc2hvdWxkU2tpcEJ1Y2tldChidWNrZXRNZXRhLCBidWNrZXQpKSB7CiAgICAgIGNvbnRpbnVlOwogICAgfQogICAgdmFsdWVzLmF2ZyA9IHZhbHVlcy5zdW0gLyB2YWx1ZXMuaXRlbXMubGVuZ3RoOwoKICAgIGNhbGN1bGF0ZU1lZGlhbih2YWx1ZXMsIHZhbHVlcy5pdGVtcyk7CiAgICBidWNrZXRzW2J1Y2tldF0gPSB2YWx1ZXM7CiAgfQogIGNvbnN0IHRvdGFsSGFzTmFOID0gdG90YWxNZXRhLmhhc05hTjsKCiAgaWYgKHRvdGFsSGFzTmFOKSB7CiAgICB0b3RhbCA9IHsgLi4ubmFuT2JqIH07CiAgfSBlbHNlIHsKICAgIHRvdGFsLmF2ZyA9IHRvdGFsLnN1bSAvIGNvcHkubGVuZ3RoOwogICAgY2FsY3VsYXRlTWVkaWFuKHRvdGFsLCBjb3B5KTsKICB9CgogIGZvciAoY29uc3QgaXRlbSBvZiBjb3B5KSB7CiAgICBjb25zdCB7IGNvbHVtbiB9ID0gaXRlbTsKICAgIGlmIChpc05hTihOdW1iZXIoY29sdW1uKSkpIHsKICAgICAgY29udGludWU7CiAgICB9CiAgICBjb25zdCBudW1Db2wgPSBOdW1iZXIoY29sdW1uKTsKICAgIGNvbnN0IGtleSA9IGAke2l0ZW0uY2F0ZWdvcnlUeXBlfS0ke2l0ZW0ucmVzdWx0VHlwZX1gOwogICAgY29uc3QgdG90YWxLZXkgPSBgJHtpdGVtLmNhdGVnb3J5VHlwZX0tdG90YWxgOwogICAgY29uc3QgYnVja2V0ID0gYnVja2V0c1trZXldOwogICAgY29uc3Qgc3ViVG90YWxCdWNrZXQgPSBidWNrZXRzW3RvdGFsS2V5XTsKICAgIGNvbnN0IGRpZmZCdWNrZXQgPSBudW1Db2wgLSBidWNrZXQuYXZnOwogICAgY29uc3QgZGlmZlN1YlRvdGFsID0gbnVtQ29sIC0gc3ViVG90YWxCdWNrZXQuYXZnOwogICAgY29uc3QgZGlmZlRvdGFsID0gbnVtQ29sIC0gdG90YWwuYXZnOwogICAgdG90YWwudmFyaWFuY2UgKz0gTWF0aC5wb3coZGlmZlRvdGFsLCAyKTsKICAgIGJ1Y2tldC52YXJpYW5jZSArPSBNYXRoLnBvdyhkaWZmQnVja2V0LCAyKTsKICAgIHN1YlRvdGFsQnVja2V0LnZhcmlhbmNlICs9IE1hdGgucG93KGRpZmZTdWJUb3RhbCwgMik7CiAgfQoKICB0b3RhbC5zdGRldiA9IE1hdGguc3FydCh0b3RhbC52YXJpYW5jZSAvIGNvcHkubGVuZ3RoKTsKCiAgZm9yIChjb25zdCBbYnVja2V0LCB2YWx1ZXNdIG9mIE9iamVjdC5lbnRyaWVzKGJ1Y2tldHMpKSB7CiAgICBpZiAoc2hvdWxkU2tpcEJ1Y2tldChidWNrZXRNZXRhLCBidWNrZXQpKSB7CiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiBPYmplY3QuZW50cmllcyh2YWx1ZXMpKSB7CiAgICAgICAgdmFsdWVzW2tleV0gPSB2YWwudG9TdHJpbmcoKTsKICAgICAgfQogICAgICBidWNrZXRzW2J1Y2tldF0gPSB2YWx1ZXM7CiAgICAgIGNvbnRpbnVlOwogICAgfQogICAgdmFsdWVzLnN0ZGV2ID0gTWF0aC5zcXJ0KHZhbHVlcy52YXJpYW5jZSAvIHZhbHVlcy5pdGVtcy5sZW5ndGgpOwoKICAgIGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiBPYmplY3QuZW50cmllcyh2YWx1ZXMpKSB7CiAgICAgIHZhbHVlc1trZXldID0gdmFsLnRvU3RyaW5nKCk7CiAgICB9CiAgICAvLyBjbGVhcmluZyBtZW1vcnkKICAgIGRlbGV0ZSB2YWx1ZXMuaXRlbXM7CiAgICBkZWxldGUgdmFsdWVzLnZhcmlhbmNlOwogICAgYnVja2V0c1tidWNrZXRdID0gdmFsdWVzOwogIH0KCiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModG90YWwpKSB7CiAgICB0b3RhbFtrZXldID0gdmFsdWUudG9TdHJpbmcoKTsKICB9CgogIGRlbGV0ZSB0b3RhbC5pdGVtczsKICBkZWxldGUgdG90YWwudmFyaWFuY2U7CgogIGNvbnN0IHJlc3VsdCA9IHsgdG90YWwsIC4uLmJ1Y2tldHMgfTsKCiAgLy8gaGFuZGxpbmcgaW4gdGVzdHMKICBwb3N0UmVzdWx0KHJlc3VsdCwgdHJhbnNhY3Rpb24pOwp9OwoKY29uc3QgcG9zdFJlc3VsdCA9IChyZXN1bHQsIHRyYW5zYWN0aW9uKSA9PiB7CiAgLy8gaGFuZGxpbmcgaW4gdGVzdHMKICBpZiAodGhpcy5tb2NrZWRQb3N0TWVzc2FnZSkgewogICAgdGhpcy5tb2NrZWRQb3N0TWVzc2FnZSh7IHJlc3VsdCwgdHJhbnNhY3Rpb24gfSk7CiAgICByZXR1cm47CiAgfQogIHBvc3RNZXNzYWdlKHsgcmVzdWx0LCB0cmFuc2FjdGlvbiB9KTsKfTsK";

export { stats };