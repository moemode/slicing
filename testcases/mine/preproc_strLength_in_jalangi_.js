J$.iids = {"8":[6,13,6,33],"9":[2,15,2,33],"10":[5,21,5,31],"16":[5,21,5,31],"17":[2,15,2,33],"18":[5,33,5,36],"25":[2,15,2,33],"33":[3,17,3,18],"34":[5,33,5,36],"41":[3,17,3,18],"42":[6,13,6,33],"49":[3,17,3,18],"50":[7,22,7,23],"57":[4,18,4,21],"65":[4,18,4,28],"73":[4,18,4,28],"81":[4,18,4,28],"89":[5,18,5,19],"97":[5,18,5,19],"105":[5,18,5,19],"113":[5,21,5,22],"121":[5,25,5,31],"137":[5,33,5,34],"145":[5,33,5,36],"161":[6,13,6,16],"169":[6,24,6,25],"177":[6,13,6,26],"179":[6,13,6,23],"185":[6,30,6,33],"193":[7,22,7,23],"201":[7,13,7,18],"209":[7,13,7,23],"217":[7,13,7,24],"225":[10,12,10,17],"233":[10,12,10,17],"241":[10,5,10,18],"249":[1,1,11,2],"257":[1,1,11,2],"265":[1,1,11,2],"273":[1,1,11,2],"281":[1,1,11,2],"289":[1,1,11,2],"297":[13,1,13,8],"305":[13,1,13,10],"313":[13,1,13,11],"321":[1,1,13,11],"329":[1,1,11,2],"337":[1,1,13,11],"345":[6,9,8,10],"353":[5,5,9,6],"361":[5,5,9,6],"369":[1,1,11,2],"377":[1,1,11,2],"385":[1,1,13,11],"393":[1,1,13,11],"nBranches":4,"originalCodeFileName":"/home/v/coding/slicing/testcases/mine/preproc_strLength_in.js","instrumentedCodeFileName":"/home/v/coding/slicing/testcases/mine/preproc_strLength_in_jalangi_.js","code":"function sliceMe() {    \n    var str = \"sample statement\";\n    var count = 0;\n    var length = str.length; // slicing criterion\n    for (var i = 0; i < length; i++) {\n        if (str.charAt(i) == \"q\") {\n            count += 1;\n        }\n    }\n    return count;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(321, '/home/v/coding/slicing/testcases/mine/preproc_strLength_in_jalangi_.js', '/home/v/coding/slicing/testcases/mine/preproc_strLength_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(249, arguments.callee, this, arguments);
                            arguments = J$.N(257, 'arguments', arguments, 4);
                            J$.N(265, 'str', str, 0);
                            J$.N(273, 'count', count, 0);
                            J$.N(281, 'length', length, 0);
                            J$.N(289, 'i', i, 0);
                            var str = J$.X1(25, J$.W(17, 'str', J$.T(9, "sample statement", 21, false), str, 1));
                            var count = J$.X1(49, J$.W(41, 'count', J$.T(33, 0, 22, false), count, 1));
                            var length = J$.X1(81, J$.W(73, 'length', J$.G(65, J$.R(57, 'str', str, 0), 'length', 0), length, 1));
                            for (var i = J$.X1(105, J$.W(97, 'i', J$.T(89, 0, 22, false), i, 1)); J$.X1(353, J$.C(16, J$.B(10, '<', J$.R(113, 'i', i, 0), J$.R(121, 'length', length, 0), 0))); J$.X1(361, J$.B(34, '-', i = J$.W(145, 'i', J$.B(26, '+', J$.U(18, '+', J$.R(137, 'i', i, 0)), J$.T(129, 1, 22, false), 0), i, 0), J$.T(153, 1, 22, false), 0))) {
                                if (J$.X1(345, J$.C(8, J$.B(42, '==', J$.M(177, J$.R(161, 'str', str, 0), 'charAt', 0)(J$.R(169, 'i', i, 0)), J$.T(185, "q", 21, false), 0)))) {
                                    J$.X1(217, count = J$.W(209, 'count', J$.B(50, '+', J$.R(201, 'count', count, 0), J$.T(193, 1, 22, false), 0), count, 0));
                                }
                            }
                            return J$.X1(241, J$.Rt(233, J$.R(225, 'count', count, 0)));
                        } catch (J$e) {
                            J$.Ex(369, J$e);
                        } finally {
                            if (J$.Fr(377))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(337, 'sliceMe', J$.T(329, sliceMe, 12, false, 249), 0);
            J$.X1(313, J$.F(305, J$.R(297, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(385, J$e);
        } finally {
            if (J$.Sr(393)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
