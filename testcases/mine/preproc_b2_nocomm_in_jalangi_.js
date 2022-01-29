J$.iids = {"8":[7,13,7,36],"9":[2,15,2,33],"10":[6,21,6,31],"16":[6,21,6,31],"17":[2,15,2,33],"18":[6,33,6,36],"25":[2,15,2,33],"33":[3,18,3,21],"34":[6,33,6,36],"41":[3,18,3,21],"42":[7,13,7,36],"49":[3,18,3,21],"50":[8,22,8,23],"57":[4,18,4,21],"65":[4,18,4,28],"73":[4,18,4,28],"81":[4,18,4,28],"89":[5,17,5,18],"97":[5,17,5,18],"105":[5,17,5,18],"113":[6,18,6,19],"121":[6,18,6,19],"129":[6,18,6,19],"137":[6,21,6,22],"145":[6,25,6,31],"161":[6,33,6,34],"169":[6,33,6,36],"185":[7,13,7,16],"193":[7,24,7,25],"201":[7,13,7,26],"203":[7,13,7,23],"209":[7,30,7,36],"217":[8,22,8,23],"225":[8,13,8,18],"233":[8,13,8,23],"241":[8,13,8,24],"249":[11,12,11,17],"257":[11,12,11,17],"265":[11,5,11,18],"273":[1,1,12,2],"281":[1,1,12,2],"289":[1,1,12,2],"297":[1,1,12,2],"305":[1,1,12,2],"313":[1,1,12,2],"321":[1,1,12,2],"329":[14,1,14,8],"337":[14,1,14,10],"345":[14,1,14,11],"353":[1,1,14,11],"361":[1,1,12,2],"369":[1,1,14,11],"377":[7,9,9,10],"385":[6,5,10,6],"393":[6,5,10,6],"401":[1,1,12,2],"409":[1,1,12,2],"417":[1,1,14,11],"425":[1,1,14,11],"nBranches":4,"originalCodeFileName":"/home/v/slicing/testcases/mine/preproc_b2_nocomm_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/preproc_b2_nocomm_in_jalangi_.js","code":"function sliceMe() {    \n    var str = \"sample statement\";\n    var letter = \"s\"\n    var length = str.length;\n    var count = 0;\n    for (var i = 0; i < length; i++) {\n        if (str.charAt(i) == letter) {\n            count += 1;\n        }\n    }\n    return count;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(353, '/home/v/slicing/testcases/mine/preproc_b2_nocomm_in_jalangi_.js', '/home/v/slicing/testcases/mine/preproc_b2_nocomm_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(273, arguments.callee, this, arguments);
                            arguments = J$.N(281, 'arguments', arguments, 4);
                            J$.N(289, 'str', str, 0);
                            J$.N(297, 'letter', letter, 0);
                            J$.N(305, 'length', length, 0);
                            J$.N(313, 'count', count, 0);
                            J$.N(321, 'i', i, 0);
                            var str = J$.X1(25, J$.W(17, 'str', J$.T(9, "sample statement", 21, false), str, 1));
                            var letter = J$.X1(49, J$.W(41, 'letter', J$.T(33, "s", 21, false), letter, 1));
                            var length = J$.X1(81, J$.W(73, 'length', J$.G(65, J$.R(57, 'str', str, 0), 'length', 0), length, 1));
                            var count = J$.X1(105, J$.W(97, 'count', J$.T(89, 0, 22, false), count, 1));
                            for (var i = J$.X1(129, J$.W(121, 'i', J$.T(113, 0, 22, false), i, 1)); J$.X1(385, J$.C(16, J$.B(10, '<', J$.R(137, 'i', i, 0), J$.R(145, 'length', length, 0), 0))); J$.X1(393, J$.B(34, '-', i = J$.W(169, 'i', J$.B(26, '+', J$.U(18, '+', J$.R(161, 'i', i, 0)), J$.T(153, 1, 22, false), 0), i, 0), J$.T(177, 1, 22, false), 0))) {
                                if (J$.X1(377, J$.C(8, J$.B(42, '==', J$.M(201, J$.R(185, 'str', str, 0), 'charAt', 0)(J$.R(193, 'i', i, 0)), J$.R(209, 'letter', letter, 0), 0)))) {
                                    J$.X1(241, count = J$.W(233, 'count', J$.B(50, '+', J$.R(225, 'count', count, 0), J$.T(217, 1, 22, false), 0), count, 0));
                                }
                            }
                            return J$.X1(265, J$.Rt(257, J$.R(249, 'count', count, 0)));
                        } catch (J$e) {
                            J$.Ex(401, J$e);
                        } finally {
                            if (J$.Fr(409))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(369, 'sliceMe', J$.T(361, sliceMe, 12, false, 273), 0);
            J$.X1(345, J$.F(337, J$.R(329, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(417, J$e);
        } finally {
            if (J$.Sr(425)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
