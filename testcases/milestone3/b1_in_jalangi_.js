J$.iids = {"8":[9,17,9,32],"9":[2,19,2,23],"10":[4,9,4,21],"16":[8,25,8,35],"17":[2,19,2,23],"18":[7,14,7,24],"24":[14,13,14,20],"25":[2,19,2,23],"26":[8,25,8,35],"32":[7,14,7,24],"33":[3,18,3,20],"34":[8,37,8,40],"40":[4,9,4,21],"41":[3,18,3,20],"49":[3,18,3,20],"50":[8,37,8,40],"57":[4,9,4,15],"58":[9,17,9,27],"65":[4,20,4,21],"66":[9,17,9,32],"73":[5,18,5,27],"81":[5,18,5,27],"89":[5,9,5,28],"97":[7,14,7,20],"105":[7,23,7,24],"113":[8,22,8,23],"121":[8,22,8,23],"129":[8,22,8,23],"137":[8,25,8,26],"145":[8,29,8,35],"161":[8,37,8,38],"169":[8,37,8,40],"185":[9,17,9,23],"193":[9,26,9,27],"201":[9,31,9,32],"209":[10,27,10,32],"217":[10,27,10,32],"225":[10,17,10,33],"233":[14,13,14,20],"241":[15,22,15,29],"249":[15,22,15,29],"257":[15,13,15,29],"265":[17,21,17,32],"273":[17,21,17,32],"281":[17,12,17,32],"289":[21,18,21,29],"297":[21,18,21,29],"305":[21,9,21,29],"313":[23,5,23,12],"321":[23,17,23,23],"329":[23,5,23,24],"331":[23,5,23,16],"337":[23,5,23,25],"345":[1,1,24,2],"353":[1,1,24,2],"361":[1,1,24,2],"369":[1,1,24,2],"377":[1,1,24,2],"385":[1,1,24,2],"393":[26,1,26,8],"401":[26,9,26,11],"409":[26,1,26,12],"417":[26,1,26,13],"425":[1,1,27,1],"433":[1,1,24,2],"441":[1,1,27,1],"449":[9,13,12,14],"457":[8,9,13,10],"465":[8,9,13,10],"473":[14,9,18,10],"481":[7,10,22,6],"489":[4,5,22,6],"497":[1,1,24,2],"505":[1,1,24,2],"513":[1,1,27,1],"521":[1,1,27,1],"nBranches":10,"originalCodeFileName":"/home/v/slicing/slicer/testcases/milestone3/b1_in.js","instrumentedCodeFileName":"/home/v/slicing/slicer/testcases/milestone3/b1_in_jalangi_.js","code":"function sliceMe(number) {    \n    var isPrime = true;\n    var status = \"\";    \n    if (number === 1) {\n        status = \"neither\";\n    }  \n    else if (number > 1) {        \n        for (var i = 2; i < number; i++) {\n            if (number % i == 0) {\n                isPrime = false;\n                break;\n            }\n        }\n        if (isPrime) {\n            status = \"prime\"\n        } else {\n           status = \"composite\"\n        }\n    }\n    else {\n        status = \"composite\"\n    }\n    console.log(status);\n}\n\nsliceMe(12);\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(425, '/home/v/slicing/slicer/testcases/milestone3/b1_in_jalangi_.js', '/home/v/slicing/slicer/testcases/milestone3/b1_in.js');
            function sliceMe(number) {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(345, arguments.callee, this, arguments);
                            arguments = J$.N(353, 'arguments', arguments, 4);
                            number = J$.N(361, 'number', number, 4);
                            J$.N(369, 'isPrime', isPrime, 0);
                            J$.N(377, 'status', status, 0);
                            J$.N(385, 'i', i, 0);
                            var isPrime = J$.X1(25, J$.W(17, 'isPrime', J$.T(9, true, 23, false), isPrime, 1));
                            var status = J$.X1(49, J$.W(41, 'status', J$.T(33, "", 21, false), status, 1));
                            if (J$.X1(489, J$.C(40, J$.B(10, '===', J$.R(57, 'number', number, 0), J$.T(65, 1, 22, false), 0)))) {
                                J$.X1(89, status = J$.W(81, 'status', J$.T(73, "neither", 21, false), status, 0));
                            } else if (J$.X1(481, J$.C(32, J$.B(18, '>', J$.R(97, 'number', number, 0), J$.T(105, 1, 22, false), 0)))) {
                                for (var i = J$.X1(129, J$.W(121, 'i', J$.T(113, 2, 22, false), i, 1)); J$.X1(457, J$.C(16, J$.B(26, '<', J$.R(137, 'i', i, 0), J$.R(145, 'number', number, 0), 0))); J$.X1(465, J$.B(50, '-', i = J$.W(169, 'i', J$.B(42, '+', J$.U(34, '+', J$.R(161, 'i', i, 0)), J$.T(153, 1, 22, false), 0), i, 0), J$.T(177, 1, 22, false), 0))) {
                                    if (J$.X1(449, J$.C(8, J$.B(66, '==', J$.B(58, '%', J$.R(185, 'number', number, 0), J$.R(193, 'i', i, 0), 0), J$.T(201, 0, 22, false), 0)))) {
                                        J$.X1(225, isPrime = J$.W(217, 'isPrime', J$.T(209, false, 23, false), isPrime, 0));
                                        break;
                                    }
                                }
                                if (J$.X1(473, J$.C(24, J$.R(233, 'isPrime', isPrime, 0)))) {
                                    J$.X1(257, status = J$.W(249, 'status', J$.T(241, "prime", 21, false), status, 0));
                                } else {
                                    J$.X1(281, status = J$.W(273, 'status', J$.T(265, "composite", 21, false), status, 0));
                                }
                            } else {
                                J$.X1(305, status = J$.W(297, 'status', J$.T(289, "composite", 21, false), status, 0));
                            }
                            J$.X1(337, J$.M(329, J$.R(313, 'console', console, 2), 'log', 0)(J$.R(321, 'status', status, 0)));
                        } catch (J$e) {
                            J$.Ex(497, J$e);
                        } finally {
                            if (J$.Fr(505))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(441, 'sliceMe', J$.T(433, sliceMe, 12, false, 345), 0);
            J$.X1(417, J$.F(409, J$.R(393, 'sliceMe', sliceMe, 1), 0)(J$.T(401, 12, 22, false)));
        } catch (J$e) {
            J$.Ex(513, J$e);
        } finally {
            if (J$.Sr(521)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
