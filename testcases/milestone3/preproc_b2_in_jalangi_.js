J$.iids = {"8":[9,13,9,36],"9":[2,15,2,33],"10":[7,21,7,31],"16":[7,21,7,31],"17":[2,15,2,33],"18":[7,33,7,36],"25":[2,15,2,33],"33":[3,18,3,21],"34":[7,33,7,36],"41":[3,18,3,21],"42":[9,13,9,36],"49":[3,18,3,21],"50":[10,22,10,23],"57":[4,18,4,21],"65":[4,18,4,28],"73":[4,18,4,28],"81":[4,18,4,28],"89":[5,17,5,18],"97":[5,17,5,18],"105":[5,17,5,18],"113":[7,18,7,19],"121":[7,18,7,19],"129":[7,18,7,19],"137":[7,21,7,22],"145":[7,25,7,31],"161":[7,33,7,34],"169":[7,33,7,36],"185":[9,13,9,16],"193":[9,24,9,25],"201":[9,13,9,26],"203":[9,13,9,23],"209":[9,30,9,36],"217":[10,22,10,23],"225":[10,13,10,18],"233":[10,13,10,23],"241":[10,13,10,24],"249":[13,12,13,17],"257":[13,12,13,17],"265":[13,5,13,18],"273":[1,1,14,2],"281":[1,1,14,2],"289":[1,1,14,2],"297":[1,1,14,2],"305":[1,1,14,2],"313":[1,1,14,2],"321":[1,1,14,2],"329":[16,1,16,8],"337":[16,1,16,10],"345":[16,1,16,11],"353":[1,1,16,11],"361":[1,1,14,2],"369":[1,1,16,11],"377":[9,9,11,10],"385":[7,5,12,6],"393":[7,5,12,6],"401":[1,1,14,2],"409":[1,1,14,2],"417":[1,1,16,11],"425":[1,1,16,11],"nBranches":4,"originalCodeFileName":"/home/v/slicing/testcases/milestone3/preproc_b2_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/milestone3/preproc_b2_in_jalangi_.js","code":"function sliceMe() {    \n    var str = \"sample statement\";\n    var letter = \"s\"\n    var length = str.length;\n    var count = 0;\n    // looping through the items\n    for (var i = 0; i < length; i++) {\n        // check if the character is at that position\n        if (str.charAt(i) == letter) {\n            count += 1;\n        }\n    }\n    return count;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(353, '/home/v/slicing/testcases/milestone3/preproc_b2_in_jalangi_.js', '/home/v/slicing/testcases/milestone3/preproc_b2_in.js');
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
