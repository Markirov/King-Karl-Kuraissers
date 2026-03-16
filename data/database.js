
        // ============================================================================
        // BASE DE DATOS UNIFICADA - ESFERA INTERIOR HASTA 3039
        // BattleMechs y Vehículos de Combate
        // Fuente: Master Unit List / Sarna.net / TRO 3039
        // ============================================================================

        const MECH_DATABASE = [
            // LIGHT MECHS (20-35 tons)
            { name: "Locust LCT-1E", bv2: 553 },
            { name: "Locust LCT-1L", bv2: 474 },
            { name: "Locust LCT-1M", bv2: 424 },
            { name: "Locust LCT-1S", bv2: 440 },
            { name: "Locust LCT-1V", bv2: 432 },
            { name: "Locust LCT-3V", bv2: 490 },
            { name: "Wasp WSP-1A", bv2: 384 },
            { name: "Wasp WSP-1D", bv2: 403 },
            { name: "Wasp WSP-1K", bv2: 376 },
            { name: "Wasp WSP-1L", bv2: 335 },
            { name: "Wasp WSP-1W", bv2: 373 },
            { name: "Stinger STG-3G", bv2: 497 },
            { name: "Stinger STG-3R", bv2: 359 },
            { name: "Flea FLE-4", bv2: 432 },
            { name: "Flea FLE-15", bv2: 430 },
            { name: "Commando COM-1D", bv2: 558 },
            { name: "Commando COM-2D", bv2: 541 },
            { name: "Commando COM-3A", bv2: 540 },
            { name: "Mongoose MON-66", bv2: 758 },
            { name: "Mongoose MON-67", bv2: 741 },
            { name: "Mongoose MON-68", bv2: 737 },
            { name: "Thorn THE-N", bv2: 546 },
            { name: "Thorn THE-S", bv2: 510 },
            { name: "Thorn THE-T", bv2: 500 },
            { name: "Hornet HNT-151", bv2: 488 },
            { name: "Hornet HNT-152", bv2: 475 },
            { name: "Hussar HSR-200-D", bv2: 636 },
            { name: "Hussar HSR-300-D", bv2: 543 },
            { name: "Hussar HSR-350-D", bv2: 731 },
            { name: "Hermes HER-1A", bv2: 601 },
            { name: "Hermes HER-1B", bv2: 666 },
            { name: "Falcon FLC-4N", bv2: 610 },
            { name: "Falcon FLC-4P", bv2: 649 },
            { name: "Javelin JVN-10F", bv2: 835 },
            { name: "Javelin JVN-10N", bv2: 594 },
            { name: "Spider SDR-5D", bv2: 524 },
            { name: "Spider SDR-5K", bv2: 503 },
            { name: "Spider SDR-5V", bv2: 622 },
            { name: "UrbanMech UM-R60", bv2: 504 },
            { name: "UrbanMech UM-R60L", bv2: 470 },
            { name: "UrbanMech UM-R63", bv2: 540 },
            { name: "Valkyrie VLK-QA", bv2: 723 },
            { name: "Valkyrie VLK-QD", bv2: 807 },
            { name: "Valkyrie VLK-QF", bv2: 653 },
            { name: "Ostscout OTT-7J", bv2: 596 },
            { name: "Ostscout OTT-7K", bv2: 484 },
            { name: "Firestarter FS9-H", bv2: 694 },
            { name: "Firestarter FS9-M", bv2: 798 },
            { name: "Jenner JR7-D", bv2: 875 },
            { name: "Jenner JR7-F", bv2: 1011 },
            { name: "Panther PNT-8Z", bv2: 741 },
            { name: "Panther PNT-9R", bv2: 769 },
            { name: "Wolfhound WLF-1", bv2: 949 },
            { name: "Wolfhound WLF-1A", bv2: 862 },
            { name: "Wolfhound WLF-1B", bv2: 880 },
            { name: "Wolfhound WLF-2", bv2: 1061 },
            { name: "Raven RVN-1X", bv2: 747 },
            { name: "Raven RVN-2X", bv2: 887 },
            { name: "Raven RVN-3X", bv2: 708 },
            { name: "Raven RVN-4X", bv2: 820 },
            // MEDIUM MECHS (40-55 tons)
            { name: "Cicada CDA-2A", bv2: 659 },
            { name: "Cicada CDA-2B", bv2: 626 },
            { name: "Cicada CDA-3C", bv2: 771 },
            { name: "Assassin ASN-21", bv2: 749 },
            { name: "Assassin ASN-23", bv2: 740 },
            { name: "Assassin ASN-101", bv2: 757 },
            { name: "Clint CLNT-1-2R", bv2: 707 },
            { name: "Clint CLNT-2-3T", bv2: 770 },
            { name: "Clint CLNT-2-4T", bv2: 619 },
            { name: "Hermes II HER-2M", bv2: 910 },
            { name: "Hermes II HER-2S", bv2: 784 },
            { name: "Hermes II HER-4K", bv2: 976 },
            { name: "Vulcan VL-2T", bv2: 642 },
            { name: "Vulcan VL-5T", bv2: 942 },
            { name: "Sentinel STN-1S", bv2: 664 },
            { name: "Sentinel STN-3K", bv2: 652 },
            { name: "Sentinel STN-3L", bv2: 717 },
            { name: "Sentinel STN-3KB", bv2: 708 },
            { name: "Whitworth WTH-0", bv2: 863 },
            { name: "Whitworth WTH-1", bv2: 982 },
            { name: "Whitworth WTH-1S", bv2: 917 },
            { name: "Phoenix Hawk PXH-1", bv2: 1041 },
            { name: "Phoenix Hawk PXH-1D", bv2: 1083 },
            { name: "Phoenix Hawk PXH-1K", bv2: 1073 },
            { name: "Blackjack BJ-1", bv2: 949 },
            { name: "Blackjack BJ-1DB", bv2: 1015 },
            { name: "Blackjack BJ-1DC", bv2: 917 },
            { name: "Blackjack BJ-1X", bv2: 1148 },
            { name: "Vindicator VND-1AA", bv2: 966 },
            { name: "Vindicator VND-1R", bv2: 1024 },
            { name: "Vindicator VND-1X", bv2: 1024 },
            { name: "Scorpion SCP-1N", bv2: 1019 },
            { name: "Hunchback HBK-4G", bv2: 1041 },
            { name: "Hunchback HBK-4H", bv2: 1067 },
            { name: "Hunchback HBK-4J", bv2: 1143 },
            { name: "Hunchback HBK-4N", bv2: 1087 },
            { name: "Hunchback HBK-4P", bv2: 1138 },
            { name: "Hunchback HBK-4SP", bv2: 1043 },
            { name: "Centurion CN9-A", bv2: 945 },
            { name: "Centurion CN9-AH", bv2: 945 },
            { name: "Centurion CN9-AL", bv2: 1057 },
            { name: "Enforcer ENF-4R", bv2: 1032 },
            { name: "Trebuchet TBT-5J", bv2: 1191 },
            { name: "Trebuchet TBT-5N", bv2: 1191 },
            { name: "Trebuchet TBT-5S", bv2: 984 },
            { name: "Trebuchet TBT-7K", bv2: 996 },
            { name: "Crab CRB-20", bv2: 1143 },
            { name: "Crab CRB-27", bv2: 1198 },
            { name: "Hatchetman HCT-3F", bv2: 854 },
            { name: "Hatchetman HCT-3X", bv2: 812 },
            { name: "Wyvern WVE-6N", bv2: 1005 },
            { name: "Wyvern WVE-5N", bv2: 1089 },
            { name: "Dervish DV-6M", bv2: 1146 },
            { name: "Griffin GRF-1N", bv2: 1272 },
            { name: "Griffin GRF-1S", bv2: 1253 },
            { name: "Shadow Hawk SHD-2D", bv2: 899 },
            { name: "Shadow Hawk SHD-2H", bv2: 1064 },
            { name: "Shadow Hawk SHD-2K", bv2: 1147 },
            { name: "Wolverine WVR-6K", bv2: 1248 },
            { name: "Wolverine WVR-6M", bv2: 1291 },
            { name: "Wolverine WVR-6R", bv2: 1101 },
            { name: "Kintaro KTO-18", bv2: 1187 },
            { name: "Kintaro KTO-19", bv2: 1160 },
            { name: "Kintaro KTO-20", bv2: 1357 },
            { name: "Champion CHP-1N", bv2: 1233 },
            { name: "Champion CHP-2N", bv2: 1116 },
            // HEAVY MECHS (60-75 tons)
            { name: "Dragon DRG-1C", bv2: 1215 },
            { name: "Dragon DRG-1N", bv2: 1125 },
            { name: "Grand Dragon DRG-1G", bv2: 1300 },
            { name: "Quickdraw QKD-4G", bv2: 1192 },
            { name: "Quickdraw QKD-4H", bv2: 1242 },
            { name: "Quickdraw QKD-5A", bv2: 1196 },
            { name: "Rifleman RFL-3C", bv2: 1066 },
            { name: "Rifleman RFL-3N", bv2: 1039 },
            { name: "Rifleman RFL-4D", bv2: 1173 },
            { name: "Lancelot LNC25-01", bv2: 1422 },
            { name: "Lancelot LNC25-02", bv2: 1236 },
            { name: "Ostroc OSR-2C", bv2: 1228 },
            { name: "Ostroc OSR-2D", bv2: 1306 },
            { name: "Ostroc OSR-2L", bv2: 1233 },
            { name: "Ostroc OSR-2M", bv2: 1239 },
            { name: "Ostroc OSR-3C", bv2: 1288 },
            { name: "Ostsol OTL-4D", bv2: 1308 },
            { name: "Ostsol OTL-4F", bv2: 1264 },
            { name: "JagerMech JM6-A", bv2: 1122 },
            { name: "JagerMech JM6-S", bv2: 901 },
            { name: "Catapult CPLT-A1", bv2: 1285 },
            { name: "Catapult CPLT-C1", bv2: 1399 },
            { name: "Catapult CPLT-C1b", bv2: 1508 },
            { name: "Catapult CPLT-C4", bv2: 1358 },
            { name: "Catapult CPLT-K2", bv2: 1319 },
            { name: "Thunderbolt TDR-5S", bv2: 1335 },
            { name: "Thunderbolt TDR-5SE", bv2: 1414 },
            { name: "Thunderbolt TDR-5SS", bv2: 1337 },
            { name: "Crusader CRD-3D", bv2: 1338 },
            { name: "Crusader CRD-3K", bv2: 1290 },
            { name: "Crusader CRD-3L", bv2: 1297 },
            { name: "Crusader CRD-3R", bv2: 1317 },
            { name: "Guillotine GLT-3N", bv2: 1418 },
            { name: "Guillotine GLT-4L", bv2: 1400 },
            { name: "Cataphract CTF-1X", bv2: 1316 },
            { name: "Cataphract CTF-2X", bv2: 1344 },
            { name: "Bombardier BMB-10D", bv2: 1340 },
            { name: "Bombardier BMB-12D", bv2: 1480 },
            { name: "Grasshopper GHR-5H", bv2: 1427 },
            { name: "Grasshopper GHR-5J", bv2: 1354 },
            { name: "Grasshopper GHR-5N", bv2: 1493 },
            { name: "Archer ARC-2K", bv2: 1356 },
            { name: "Archer ARC-2R", bv2: 1477 },
            { name: "Archer ARC-2Rb", bv2: 1627 },
            { name: "Archer ARC-2S", bv2: 1393 },
            { name: "Archer ARC-2W", bv2: 1338 },
            { name: "Warhammer WHM-6D", bv2: 1471 },
            { name: "Warhammer WHM-6K", bv2: 1305 },
            { name: "Warhammer WHM-6L", bv2: 1311 },
            { name: "Warhammer WHM-6R", bv2: 1299 },
            { name: "Flashman FLS-7K", bv2: 1480 },
            { name: "Flashman FLS-8K", bv2: 1779 },
            { name: "Black Knight BL-6-KNT", bv2: 1551 },
            { name: "Black Knight BL-7-KNT", bv2: 1443 },
            { name: "Black Knight BL-7-KNT-L", bv2: 1409 },
            { name: "Marauder MAD-3D", bv2: 1470 },
            { name: "Marauder MAD-3L", bv2: 1369 },
            { name: "Marauder MAD-3M", bv2: 1335 },
            { name: "Marauder MAD-3R", bv2: 1363 },
            { name: "Orion ON1-K", bv2: 1429 },
            { name: "Orion ON1-M", bv2: 1414 },
            { name: "Orion ON1-V", bv2: 1298 },
            { name: "Orion ON1-VA", bv2: 1328 },
            // ASSAULT MECHS (80-100 tons)
            { name: "Thug THG-10E", bv2: 1501 },
            { name: "Thug THG-11E", bv2: 1640 },
            { name: "Goliath GOL-1H", bv2: 1449 },
            { name: "Goliath GOL-3M", bv2: 1540 },
            { name: "Awesome AWS-8Q", bv2: 1605 },
            { name: "Awesome AWS-8R", bv2: 1470 },
            { name: "Awesome AWS-8T", bv2: 1593 },
            { name: "Awesome AWS-8V", bv2: 1510 },
            { name: "Zeus ZEU-6S", bv2: 1348 },
            { name: "Zeus ZEU-6T", bv2: 1436 },
            { name: "Charger CGR-1A1", bv2: 981 },
            { name: "Charger CGR-1A5", bv2: 1468 },
            { name: "Charger CGR-1A9", bv2: 1397 },
            { name: "Charger CGR-1L", bv2: 980 },
            { name: "Charger CGR-SB", bv2: 1604 },
            { name: "Victor VTR-9A", bv2: 1236 },
            { name: "Victor VTR-9A1", bv2: 1302 },
            { name: "Victor VTR-9B", bv2: 1378 },
            { name: "Victor VTR-9S", bv2: 1360 },
            { name: "BattleMaster BLR-1D", bv2: 1522 },
            { name: "BattleMaster BLR-1G", bv2: 1519 },
            { name: "BattleMaster BLR-1G-DC", bv2: 1498 },
            { name: "BattleMaster BLR-1S", bv2: 1507 },
            { name: "Stalker STK-3F", bv2: 1559 },
            { name: "Stalker STK-3H", bv2: 1624 },
            { name: "Stalker STK-4N", bv2: 1558 },
            { name: "Longbow LGB-0W", bv2: 1337 },
            { name: "Longbow LGB-7Q", bv2: 1618 },
            { name: "Hatamoto-Chi HTM-26T", bv2: 1536 },
            { name: "Hatamoto-Chi HTM-27T", bv2: 1607 },
            { name: "Highlander HGN-732", bv2: 2227 },
            { name: "Highlander HGN-733", bv2: 1801 },
            { name: "Highlander HGN-733C", bv2: 1710 },
            { name: "Highlander HGN-733P", bv2: 1696 },
            { name: "Cyclops CP-10-Q", bv2: 1584 },
            { name: "Cyclops CP-10-Z", bv2: 1317 },
            { name: "Banshee BNC-3E", bv2: 1422 },
            { name: "Banshee BNC-3M", bv2: 1595 },
            { name: "Banshee BNC-3Q", bv2: 1394 },
            { name: "Banshee BNC-3S", bv2: 1751 },
            { name: "King Crab KGC-0000", bv2: 1810 },
            { name: "King Crab KGC-000", bv2: 1906 },
            { name: "King Crab KGC-010", bv2: 2181 },
            { name: "Marauder II MAD-4A", bv2: 2073 },
            { name: "Atlas AS7-D", bv2: 1897 },
            { name: "Atlas AS7-D-DC", bv2: 1858 },
            { name: "Atlas AS7-RS", bv2: 1849 },
            // Additional Star League / Succession Wars Era
            { name: "Sai S-3", bv2: 959 },
            { name: "Sai S-4", bv2: 1005 },
            { name: "Sai S-4C", bv2: 1778 },
            { name: "Sai S-4X", bv2: 830 },
            { name: "Sai S-7", bv2: 876 },
            { name: "Sai S-8", bv2: 1304 },
            { name: "Exterminator EXT-4A", bv2: 1345 },
            { name: "Exterminator EXT-4C", bv2: 1228 },
            { name: "Exterminator EXT-4D", bv2: 1385 },
            { name: "Spector SPR-4F", bv2: 988 },
            { name: "Spector SPR-5F", bv2: 1183 },
            { name: "Mercury MCY-97", bv2: 469 },
            { name: "Mercury MCY-98", bv2: 553 },
            { name: "Mercury MCY-99", bv2: 590 },
            { name: "Talon TLN-5W", bv2: 1175 },
            { name: "Starslayer STY-2C", bv2: 1369 },
            { name: "Albatross ALB-3U", bv2: 1668 },
            { name: "Nightsky NGS-4S", bv2: 1159 },
            { name: "Hoplite HOP-4B", bv2: 989 },
            { name: "Hoplite HOP-4C", bv2: 1022 },
            { name: "Hoplite HOP-4D", bv2: 1022 },
            { name: "Buccaneer BCN-3R", bv2: 1434 },
            { name: "Lineholder KW1-LH2", bv2: 1280 },
            { name: "Lineholder KW1-LH3", bv2: 1214 },
            { name: "Osprey OSP-15", bv2: 1106 },
            { name: "Osprey OSP-25", bv2: 1183 },
            { name: "Osprey OSP-26", bv2: 1122 },
            { name: "Merlin MLN-1A", bv2: 1217 },
            { name: "Merlin MLN-1B", bv2: 1205 },
            { name: "Caesar CES-3R", bv2: 1578 },
            { name: "Thanatos THS-4S", bv2: 2008 },
            { name: "Cestus CTS-6X", bv2: 1600 },
            { name: "Cestus CTS-6Y", bv2: 1701 },
            { name: "Spartan SPT-NF", bv2: 1605 },
            { name: "Spartan SPT-N1", bv2: 1573 },
            { name: "Spartan SPT-N2", bv2: 1605 },
            { name: "Crockett CRK-5003-0", bv2: 1704 },
            { name: "Crockett CRK-5003-1", bv2: 1923 },
            { name: "Emperor EMP-5A", bv2: 1571 },
            { name: "Emperor EMP-6A", bv2: 1969 },
            { name: "Pillager PLG-1N", bv2: 1622 },
            { name: "Pillager PLG-3Z", bv2: 2697 },
            { name: "Nightstar NSR-9J", bv2: 2399 }
        ];

        const VEHICLE_DATABASE = [
            // VTOL / HELICOPTERS
            { name: "Ferret Light Scout VTOL", bv2: 56, type: "VTOL" },
            { name: "Ferret Light Scout VTOL (Armor)", bv2: 74, type: "VTOL" },
            { name: "Ferret Light Scout VTOL (Cargo)", bv2: 17, type: "VTOL" },
            { name: "Warrior H-7", bv2: 309, type: "VTOL" },
            { name: "Warrior H-7A", bv2: 305, type: "VTOL" },
            { name: "Warrior H-7C", bv2: 444, type: "VTOL" },
            { name: "Karnov UR Transport", bv2: 125, type: "VTOL" },
            { name: "Karnov UR Transport (AC)", bv2: 190, type: "VTOL" },
            { name: "Karnov UR Transport (Artillery)", bv2: 169, type: "VTOL" },
            { name: "Karnov UR Transport (Gunship)", bv2: 352, type: "VTOL" },
            // HOVER
            { name: "Savannah Master Hovercraft", bv2: 215, type: "Hover" },
            { name: "Savannah Master Hovercraft (SL)", bv2: 194, type: "Hover" },
            { name: "Swift Wind Scout Car", bv2: 83, type: "Wheeled" },
            { name: "Swift Wind Scout Car (ICE)", bv2: 83, type: "Wheeled" },
            { name: "Harasser Missile Platform", bv2: 433, type: "Hover" },
            { name: "Harasser Laser Platform", bv2: 233, type: "Hover" },
            { name: "Harasser Missile Platform (Flamer)", bv2: 253, type: "Hover" },
            { name: "Harasser Missile Platform (LRM)", bv2: 412, type: "Hover" },
            { name: "J. Edgar Light Hover Tank", bv2: 544, type: "Hover" },
            { name: "J. Edgar Light Hover Tank (Flamer)", bv2: 454, type: "Hover" },
            { name: "J. Edgar Light Hover Tank (ICE)", bv2: 320, type: "Hover" },
            { name: "J. Edgar Light Hover Tank (MG)", bv2: 482, type: "Hover" },
            { name: "Sea Skimmer Hydrofoil", bv2: 306, type: "Naval" },
            { name: "Pegasus Scout Hovertank", bv2: 640, type: "Hover" },
            { name: "Pegasus Scout Hovertank (Missile)", bv2: 652, type: "Hover" },
            { name: "Pegasus Scout Hovertank (Sensors)", bv2: 476, type: "Hover" },
            { name: "Saladin Assault Hover Tank", bv2: 596, type: "Hover" },
            { name: "Saracen Medium Hover Tank", bv2: 673, type: "Hover" },
            { name: "Scimitar Medium Hover Tank", bv2: 532, type: "Hover" },
            { name: "Scimitar Medium Hover Tank (Missile)", bv2: 576, type: "Hover" },
            { name: "Condor Heavy Hover Tank", bv2: 653, type: "Hover" },
            { name: "Condor Heavy Hover Tank (Davion)", bv2: 611, type: "Hover" },
            { name: "Condor Heavy Hover Tank (Liao)", bv2: 765, type: "Hover" },
            { name: "Drillson Heavy Hover Tank", bv2: 969, type: "Hover" },
            { name: "Drillson Heavy Hover Tank (SRM)", bv2: 945, type: "Hover" },
            { name: "Maxim Heavy Hover Transport", bv2: 764, type: "Hover" },
            { name: "APC (Hover)", bv2: 126, type: "Hover" },
            { name: "APC (Hover LRM)", bv2: 165, type: "Hover" },
            { name: "APC (Hover SRM)", bv2: 151, type: "Hover" },
            { name: "Coolant Truck (Hover)", bv2: 108, type: "Hover" },
            // WHEELED
            { name: "APC (Wheeled)", bv2: 102, type: "Wheeled" },
            { name: "APC (Wheeled LRM)", bv2: 137, type: "Wheeled" },
            { name: "APC (Wheeled SRM)", bv2: 127, type: "Wheeled" },
            { name: "Skulker Wheeled Scout Tank", bv2: 314, type: "Wheeled" },
            { name: "Skulker Wheeled Scout Tank (MG)", bv2: 269, type: "Wheeled" },
            { name: "Skulker Wheeled Scout Tank (SRM)", bv2: 319, type: "Wheeled" },
            { name: "Packrat LRPV PKR-T5", bv2: 344, type: "Wheeled" },
            { name: "Packrat LRPV PKR-T5 (ICE)", bv2: 253, type: "Wheeled" },
            { name: "Hetzer Wheeled Assault Gun", bv2: 574, type: "Wheeled" },
            { name: "Hetzer Wheeled Assault Gun (AC10)", bv2: 427, type: "Wheeled" },
            { name: "Hetzer Wheeled Assault Gun (Laser)", bv2: 464, type: "Wheeled" },
            { name: "Hetzer Wheeled Assault Gun (LRM)", bv2: 433, type: "Wheeled" },
            { name: "Hetzer Wheeled Assault Gun (SRM)", bv2: 491, type: "Wheeled" },
            { name: "J-27 Ordnance Transport", bv2: 34, type: "Tracked" },
            { name: "M.A.S.H. Truck", bv2: 220, type: "Wheeled" },
            { name: "Coolant Truck", bv2: 114, type: "Wheeled" },
            // TRACKED
            { name: "APC (Tracked)", bv2: 112, type: "Tracked" },
            { name: "APC (Tracked LRM)", bv2: 148, type: "Tracked" },
            { name: "APC (Tracked SRM)", bv2: 138, type: "Tracked" },
            { name: "Scorpion Light Tank", bv2: 306, type: "Tracked" },
            { name: "Scorpion Light Tank (LRM)", bv2: 388, type: "Tracked" },
            { name: "Scorpion Light Tank (ML)", bv2: 330, type: "Tracked" },
            { name: "Scorpion Light Tank (SRM)", bv2: 373, type: "Tracked" },
            { name: "Hunter Light Support Tank", bv2: 648, type: "Tracked" },
            { name: "Hunter Light Support Tank (LRM10)", bv2: 573, type: "Tracked" },
            { name: "Hunter Light Support Tank (LRM15)", bv2: 656, type: "Tracked" },
            { name: "Striker Light Tank", bv2: 564, type: "Wheeled" },
            { name: "Striker Light Tank (LRM)", bv2: 605, type: "Wheeled" },
            { name: "Engineering Vehicle", bv2: 152, type: "Tracked" },
            { name: "Goblin Medium Tank", bv2: 555, type: "Tracked" },
            { name: "Goblin Medium Tank (SRM)", bv2: 647, type: "Tracked" },
            { name: "Goblin Medium Tank (LRM)", bv2: 656, type: "Tracked" },
            { name: "Vedette Medium Tank", bv2: 475, type: "Tracked" },
            { name: "Vedette Medium Tank (AC2)", bv2: 458, type: "Tracked" },
            { name: "Vedette Medium Tank (Liao)", bv2: 494, type: "Tracked" },
            { name: "Bulldog Medium Tank", bv2: 605, type: "Tracked" },
            { name: "Bulldog Medium Tank (AC2)", bv2: 524, type: "Tracked" },
            { name: "Bulldog Medium Tank (LRM)", bv2: 748, type: "Tracked" },
            { name: "Manticore Heavy Tank", bv2: 993, type: "Tracked" },
            { name: "LRM Carrier", bv2: 833, type: "Tracked" },
            { name: "SRM Carrier", bv2: 816, type: "Tracked" },
            { name: "AC/2 Carrier", bv2: 403, type: "Tracked" },
            { name: "Laser Carrier", bv2: 689, type: "Tracked" },
            { name: "Pike Support Vehicle", bv2: 648, type: "Tracked" },
            { name: "Pike Support Vehicle (AC5)", bv2: 623, type: "Tracked" },
            { name: "Pike Support Vehicle (Missile)", bv2: 847, type: "Tracked" },
            { name: "Patton Tank", bv2: 943, type: "Tracked" },
            { name: "Rommel Tank", bv2: 955, type: "Tracked" },
            { name: "Von Luckner Heavy Tank VNL-K65N", bv2: 1101, type: "Tracked" },
            { name: "Demolisher Heavy Tank", bv2: 981, type: "Tracked" },
            { name: "Devastator Heavy Tank", bv2: 1058, type: "Tracked" },
            { name: "Mobile Long Tom Artillery", bv2: 1471, type: "Tracked" },
            { name: "Partisan Heavy Tank", bv2: 673, type: "Tracked" },
            { name: "Partisan Heavy Tank (AC2)", bv2: 580, type: "Tracked" },
            { name: "Partisan Heavy Tank (LRM)", bv2: 1021, type: "Tracked" },
            { name: "Schrek PPC Carrier", bv2: 957, type: "Tracked" },
            { name: "SturmFeur Heavy Tank", bv2: 1400, type: "Tracked" },
            { name: "Ontos Heavy Tank", bv2: 960, type: "Tracked" },
            { name: "Ontos Heavy Tank (LRM)", bv2: 1249, type: "Tracked" },
            { name: "Behemoth Heavy Tank", bv2: 1173, type: "Tracked" },
            { name: "Behemoth Heavy Tank (Flamer)", bv2: 1084, type: "Tracked" },
            { name: "Mobile Headquarters", bv2: 319, type: "Wheeled" },
            { name: "Hi-Scout Drone Carrier", bv2: 347, type: "Tracked" },
            { name: "Galleon Light Tank GAL-100", bv2: 309, type: "Tracked" },
            { name: "Galleon Light Tank GAL-200", bv2: 345, type: "Tracked" },
            { name: "Axel Heavy Tank Mk 1", bv2: 610, type: "Tracked" },
            { name: "Axel Heavy Tank Mk 2", bv2: 589, type: "Tracked" },
            { name: "Zhukov Heavy Tank", bv2: 920, type: "Tracked" },
            // NAVAL
            { name: "Monitor Naval Vessel", bv2: 799, type: "Naval" },
        ];

        // ============================================================================
        // FUNCIONES DE BÚSQUEDA DE UNIDADES
        // ============================================================================

        function searchMechs(query) {
            if (!query || query.trim() === '') return [];
            const searchTerm = query.toLowerCase().trim();
            return MECH_DATABASE.filter(mech => 
                mech.name.toLowerCase().includes(searchTerm)
            ).sort((a, b) => {
                const aStartsWith = a.name.toLowerCase().startsWith(searchTerm);
                const bStartsWith = b.name.toLowerCase().startsWith(searchTerm);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.name.localeCompare(b.name);
            });
        }

        function searchVehicles(query) {
            if (!query || query.trim() === '') return [];
            const searchTerm = query.toLowerCase().trim();
            return VEHICLE_DATABASE.filter(vehicle => 
                vehicle.name.toLowerCase().includes(searchTerm)
            ).sort((a, b) => {
                const aStartsWith = a.name.toLowerCase().startsWith(searchTerm);
                const bStartsWith = b.name.toLowerCase().startsWith(searchTerm);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.name.localeCompare(b.name);
            });
        }

        function searchAllUnits(query) {
            if (!query || query.trim() === '') return { mechs: [], vehicles: [] };
            return {
                mechs: searchMechs(query),
                vehicles: searchVehicles(query)
            };
        }

        function getMechByName(name) {
            return MECH_DATABASE.find(m => m.name.toLowerCase() === name.toLowerCase()) || null;
        }

        function getVehicleByName(name) {
            return VEHICLE_DATABASE.find(v => v.name.toLowerCase() === name.toLowerCase()) || null;
        }

        function getUnitByName(name) {
            return getMechByName(name) || getVehicleByName(name);
        }

        function getMechsByBVRange(minBV, maxBV) {
            return MECH_DATABASE.filter(m => m.bv2 >= minBV && m.bv2 <= maxBV).sort((a, b) => a.bv2 - b.bv2);
        }

        function getVehiclesByBVRange(minBV, maxBV) {
            return VEHICLE_DATABASE.filter(v => v.bv2 >= minBV && v.bv2 <= maxBV).sort((a, b) => a.bv2 - b.bv2);
        }

        function getVehiclesByType(type) {
            return VEHICLE_DATABASE.filter(v => v.type.toLowerCase() === type.toLowerCase()).sort((a, b) => a.bv2 - b.bv2);
        }

        console.log(`📊 Base de datos IS 3039: ${MECH_DATABASE.length} BattleMechs, ${VEHICLE_DATABASE.length} Vehículos`);

        // --- CONFIGURACIÓN GOOGLE APPS SCRIPT ---
        // Usa localStorage si hay una URL personalizada guardada, si no usa la por defecto
        const GOOGLE_SCRIPT_URL_DEFAULT = "https://script.google.com/macros/s/AKfycbyAAh-lYB1L72hTH72lpYDD0mcaAyeERLjJp1e0Ar0hhuZK8TszJdu-qmlN_cwi4sEncQ/exec";
        const GOOGLE_SCRIPT_URL = localStorage.getItem('GOOGLE_SCRIPT_URL_CUSTOM') || GOOGLE_SCRIPT_URL_DEFAULT;

        // ============================================================================
        // VARIABLE GLOBAL PARA PERSONAJE ACTUAL EN BARRACONES
        // ============================================================================
        /**
         * Almacena los datos completos del personaje cargado en Barracones
         * Se actualiza cada vez que se carga un personaje via cargarPersonajeEnBarracones()
         * Usado por generarPDFPersonaje() para acceder a datos que no están en inputs
         */
        let datosPersonajeBarracones = null;

        // ============================================================================
        // CONSTANTES DE CONFIGURACIÓN
        // ============================================================================
        /**
         * Constantes de temporización para operaciones asíncronas
         * Estos valores se ajustaron mediante pruebas para asegurar que el DOM
         * esté completamente renderizado antes de operar sobre él
         */
        const TIMING = {
            // Tiempo de espera para que la tabla de habilidades se renderice
            SKILLS_TABLE_RENDER: 100,
                // Tiempo de espera para que los cuadrados de HP se generen
            HP_GENERATION: 150,
                // Tiempo de espera para cargar armas (después de poblar selectores)
            WEAPON_LOAD: 150,
                // Tiempo adicional para cargar munición (después de arma cargada)
            AMMO_LOAD: 50,
                // Timeout para requests HTTP (en ms)
            HTTP_TIMEOUT: 30000
        };
        /**
         * Prefijos de IDs para diferentes secciones de la aplicación
         * Facilita la construcción de selectores dinámicos
         */
        const ID_PREFIXES = {
            BARRACONES: 'barr-',
            GENERADOR: 'select-',
            SKILL_BARRACONES: 'barr-skill-',
            SKILL_GENERADOR: 'skill-'
        };
        /**
         * Clases CSS utilizadas en la aplicación
         * Centralizadas para fácil referencia y mantenimiento
         */
        const CSS_CLASSES = {
            // Cuadrados de HP (ambas orientaciones)
            HP_SEGMENT: 'barracones-hp-segment',
            HP_SEGMENT_VERTICAL: 'barracones-hp-segment-vertical',
                // Estado de daño
            DAMAGED: 'damaged',
                // Cuadrados de mejora
            ATTR_UPGRADE: 'barracones-attr-upgrade',
            SKILL_UPGRADE: 'barracones-skill-upgrade',
            SELECTED: 'selected',
                // Inputs
            BARRACONES_INPUT: 'barracones-input'
        };
        /**
         * Nombres de atributos para iterar
         */
        const ATTRIBUTES = ['fue', 'des', 'int', 'car'];
        /**
         * Mensajes de error estandarizados
         */
        const ERROR_MESSAGES = {
            NO_NAME: 'El personaje necesita un nombre para guardarse.',
            NO_PLAYER: 'El personaje necesita un nombre de jugador.',
            GOOGLE_SCRIPT_NOT_CONFIGURED: '¡Error! Debes configurar la variable GOOGLE_SCRIPT_URL en el código HTML primero.',
            CONNECTION_ERROR: 'Error de conexión con la nube',
            NO_RESULTS: 'No se encontraron personajes para ese jugador.',
            GENERIC_ERROR: 'Ocurrió un error inesperado'
        };

        // --- DATOS ---
        const COSTS_STR = { 2: -110, 3: -50, 4: -20, 5: -5, 6: 0, 7: 10, 8: 30, 9: 70, 10: 150, 11: 300, 12: 600 };
        const COSTS_DEX = { 2: -135, 3: -65, 4: -30, 5: -10, 6: 0, 7: 15, 8: 45, 9: 95, 10: 195, 11: 395, 12: 795 };
        const COSTS_INT = { 2: -160, 3: -80, 4: -40, 5: -15, 6: 0, 7: 20, 8: 60, 9: 120, 10: 245, 11: 495, 12: 995 };
        const COSTS_CHA = { 2: -95, 3: -45, 4: -20, 5: -5, 6: 0, 7: 10, 8: 30, 9: 70, 10: 150, 11: 300, 12: 600 };
        const STUDY_COSTS = { "Academia de Oficiales": 100, "Academia de Combate": 75, "Tutores Nobles": 85, "Autodidacta": 65, "": 0 };
        const XP_LEVEL_COSTS = { 1: 750, 2: 1750, 3: 2500, 4: 3500 };

        const ORIGIN_LIST = [
            "Alianza de Mundos Exteriores", "Coalición Auriga", "Concordato de Tauro", 
            "Condominio Draconis", "Confederación de Capela", "Confederación de Oberon",
            "Federación de Circinus", "Federación de Soles", "Hegemonía Mariana",
            "Liga de Mundos Libres", "Magistratura de Canopus", "Mancomunidad Lirana"
        ].sort();

        const FACTION_LIST = [
            {v: "Casa Avellar (Alianza de Mundos Exteriores)", t: "Alianza de Mundos Exteriores"},
            {v: "Casa Arano (Coalición Auriga)", t: "Coalición Auriga"},
            {v: "Casa Calderon (Concordato de Tauro)", t: "Concordato de Tauro"},
            {v: "Casa Kurita (Condominio Draconis)", t: "Casa Kurita"},
            {v: "Casa Liao (Confederación de Capella)", t: "Casa Liao"},
            {v: "Casa Grimm (Confederación de Oberon)", t: "Confederación de Oberon"},
            {v: "Casa McIntyre (Federación de Circinus)", t: "Federación de Circinus"},
            {v: "Casa Davion (Federacion de Soles)", t: "Casa Davion"},
            {v: "Casa O'Reilly (Hegemonía Mariana)", t: "Hegemonía Mariana"},
            {v: "Casa Marik (Liga de Mundos Libres)", t: "Casa Marik"},
            {v: "Casa Centrella (Magistratura de Canopus)", t: "Magistratura de Canopus"},
            {v: "Casa Steiner (Mancomunidad de Lira)", t: "Casa Steiner"},
            {v: "Mercenario (Unidad Mercenaria)", t: "Mercenario"}
        ].sort((a, b) => a.t.localeCompare(b.t));

        const EXTRA_SKILLS = ["Atletismo", "Arco", "Espada", "Pelea", "Informática", "Diplomacia", "Conducir", "Ingeniería", "Disparo Aeroespacial", "Disparo Artillería", "Disparo Mech", "Interrogación", "AstroPilotaje", "Astronavegación", "Admin. de Feudo", "Liderazgo", "Mecánica", "Primeros Auxilios", "Pilotar Aeroespacial", "Pilotar Mech", "Pistola", "Rifle", "Pícaro", "Callejeo", "Supervivencia", "Tácticas", "Técnica Mech"].sort();

        const MERIT_COSTS = { "Ambidiestro Indiferente": 20, "Ambidiestro Ambas": 40, "Atractivo": 10, "Valiente": 10, "Sexto sentido": 20, "Contactos leves": 5, "Contactos medios": 10, "Contactos poderosos": 20, "Aptitud natural": 20, "Sentidos agudos": 10, "Reputacion leve": 5, "Reputacion media": 10, "Reputacion elevada": 20, "Resistencia al dolor": 10, "Resistencia a las drogas": 10, "Riqueza leve": 5, "Riqueza media": 10, "Riqueza elevada": 20, "Nobleza baja": 5, "Nobleza media": 10, "Nobleza alta": 20, "Fuerte": 20 };
        const DEMERIT_COSTS = { "Adiccion leve": 10, "Adiccion fuerte": 20, "Mala reputacion leve": 5, "Mala reputacion media": 10, "Mala reputacion alta": 20, "Terror de combate leve": 10, "Terror de combate alto": 20, "Enemigo debil": 5, "Enemigo medio": 10, "Enemigo poderoso": 20, "SDT": 10, "Deudas leves": 5, "Deudas medias": 10, "Deudas elevadas": 20, "Ineptitud natural": 20, "Repulsivo": 10, "Gafe": 10, "Debil": 20 };
        const WEAPON_LIST = {
            "Arco Corto": { dmg: "1D6+1", s: "2", m: "5", l: "8", car: "8", rec: "1", w: "2" },
            "Arco Largo": { dmg: "2D6+3", s: "4", m: "9", l: "14", car: "8", rec: "1", w: "3" },
            "Ballesta Ligera": { dmg: "2D6", s: "2", m: "5", l: "10", car: "1", rec: "1", w: "4" },
            "Ballesta Pesada": { dmg: "2D6+3", s: "3", m: "7", l: "13", car: "1", rec: "1", w: "6" },
            "Blazer": { dmg: "4D6+2 X2", s: "9", m: "21", l: "30", car: "2", rec: "1", w: "10" },
            "Carabina GyroSlug": { dmg: "2D6+5", s: "6", m: "15", l: "30", car: "20", rec: "1", w: "3" },
            "Escopeta": { dmg: "3D6+2", s: "3", m: "5", l: "8", car: "6", rec: "1", w: "4" },
            "Escopeta 2 cañones": { dmg: "3D6+2", s: "3", m: "4", l: "5", car: "2", rec: "1", w: "3" },
            "Lanzador AMCA": { dmg: "5D6+6", s: "10", m: "36", l: "54", car: "2", rec: "1", w: "18" },
            "Lanzador AMCA Pesado": { dmg: "10D6+6", s: "15", m: "40", l: "48", car: "4", rec: "4", w: "20" },
            "Lanzallamas": { dmg: "2D6", s: "2", m: "4", l: "6", car: "12", rec: "1", w: "15" },
            "Mauser 960 Lanzagranadas": { dmg: "2D6+3", s: "6", m: "15", l: "25", car: "6", rec: "-", w: "10" },
            "Mauser 960 Laser Pulso": { dmg: "3D6+3", s: "7", m: "15", l: "30", car: "10", rec: "-", w: "10" },
            "MG": { dmg: "4D6+3", s: "10", m: "20", l: "42", car: "15", rec: "1", w: "10" },
            "Pistola Agujas": { dmg: "1D6+2", s: "3", m: "-", l: "-", car: "10", rec: "1", w: "1" },
            "Pistola Automatica": { dmg: "2D6", s: "2", m: "4", l: "8", car: "10", rec: "1", w: "1.5" },
            "Pistola Automatica Mydron": { dmg: "1D6+3", s: "2", m: "4", l: "12", car: "20", rec: "1", w: "1.5" },
            "Pistola de Pulsos": { dmg: "3D6", s: "2", m: "4", l: "8", car: "10", rec: "1", w: "1" },
            "Pistola GyroJet": { dmg: "3D6+3", s: "1", m: "2", l: "-", car: "2", rec: "1", w: "2" },
            "Pistola Laser": { dmg: "4D6", s: "3", m: "6", l: "12", car: "20", rec: "1", w: "1" },
            "Pistola Laser Nakjama": { dmg: "3D6", s: "4", m: "9", l: "14", car: "20", rec: "1", w: "1" },
            "Pistola Laser Sunbeam": { dmg: "5D6", s: "3", m: "6", l: "11", car: "5", rec: "1", w: "1" },
            "Pistola LaserM": { dmg: "2D6", s: "2", m: "4", l: "6", car: "3", rec: "1", w: "0.5" },
            "Pistola Semi": { dmg: "2D6+3", s: "2", m: "4", l: "8", car: "6", rec: "1", w: "1" },
            "Pistola Sonica": { dmg: "S", s: "2", m: "5", l: "8", car: "25", rec: "1", w: "1.5" },
            "Pistola Sternsnacht": { dmg: "4D6+2", s: "2", m: "4", l: "12", car: "3", rec: "1", w: "2.5" },
            "Pistola Tranquilizante": { dmg: "S", s: "2", m: "4", l: "6", car: "10", rec: "1", w: "1" },
            "PistolaM": { dmg: "1D6+3", s: "2", m: "-", l: "-", car: "5", rec: "1", w: "0.5" },
            "PistolaM Agujas": { dmg: "1D6", s: "1", m: "-", l: "-", car: "5", rec: "1", w: "0.3" },
            "Rifle": { dmg: "3D6", s: "6", m: "15", l: "30", car: "10", rec: "1", w: "4" },
            "Rifle Agujas": { dmg: "2D6+2", s: "6", m: "7", l: "8", car: "20", rec: "1", w: "2" },
            "Rifle de Pulsos": { dmg: "3D6+2", s: "6", m: "14", l: "28", car: "5", rec: "1", w: "5" },
            "Rifle Federated": { dmg: "2D6+2", s: "8", m: "18", l: "33", car: "10", rec: "1", w: "4.5" },
            "Rifle GyroJet": { dmg: "3D6+6", s: "12", m: "36", l: "72", car: "10", rec: "1", w: "6" },
            "Rifle GyroJet Pesado": { dmg: "6D6+6", s: "12", m: "36", l: "72", car: "5", rec: "1", w: "18" },
            "Rifle GyroSlug": { dmg: "3D6+3", s: "8", m: "35", l: "42", car: "50", rec: "1", w: "12" },
            "Rifle Laser": { dmg: "4D6+2", s: "9", m: "21", l: "42", car: "10", rec: "1", w: "5" },
            "Rifle Laser Intek": { dmg: "2D6+2", s: "12", m: "30", l: "51", car: "10", rec: "1", w: "8" },
            "Rifle Laser MagnaStar": { dmg: "4D6+2", s: "9", m: "21", l: "30", car: "4", rec: "1", w: "5" },
            "Rifle Pesado Zeus": { dmg: "6D6", s: "7", m: "18", l: "28", car: "5", rec: "1", w: "12" },
            "SMG": { dmg: "3D6", s: "3", m: "7", l: "10", car: "50", rec: "1", w: "3" },
            "SMG Imperator": { dmg: "2D6", s: "4", m: "8", l: "11", car: "50", rec: "1", w: "4" },
            "SMG Rorynex": { dmg: "3D6+3", s: "3", m: "6", l: "9", car: "100", rec: "1", w: "3" }
        };

        const SKILL_BUY_COSTS = { 1: 20, 2: 30, 3: 50, 4: 80, 5: 130, 6: 210, 7: 330, 8: 490, "": 0 }; 

        const MECH_TABLE_ELH = { 1: { model: "Dervish DV-6M", tons: 55 }, 2: { model: "Gladiator GLD-4R", tons: 55 }, 3: { model: "Griffin GRF-1N", tons: 55 }, 4: { model: "Wolverine WVR-6M", tons: 55 }, 5: { model: "Shadow Hawk-2ELH", tons: 55 }, 6: { model: "Wolverine WVR-6R", tons: 55 }, 7: { model: "Wolverine WVR-6S", tons: 55 }, 8: { model: "Wolverine WVR-6D", tons: 55 }, 9: { model: "Quickdraw QKD-5A", tons: 60 }, 10: { model: "Merlin MLN-1A", tons: 60 }, 11: { model: "Exterminator EXT-4A", tons: 65 }, 12: { model: "Catapult CPT-C1", tons: 65 }, 13: { model: "Thunderbolt-5SE", tons: 65 }, 14: { model: "Grasshopper GHR-5H", tons: 70 }, 15: { model: "Guillotine GLT-4L", tons: 70 }, 16: { model: "BattleAxe BKX-7K", tons: 70 } };
        const MECH_TABLE_IS = { "-1": { model: "Locust, Wasp, Stinger", tons: 20 }, "0": { model: "Commando", tons: 25 }, "1": { model: "Javelin, Spider, Valkyrie, Urbanmech", tons: 30 }, "2": { model: "Locust, Wasp, Stinger", tons: 20 }, "3":  { model: "Commando", tons: 25 }, "4": { model: "Javelin, Spider, Valkyrie, Urbanmech", tons: 30 }, "5": { model: "Firestarter, Jenner, Panthter, Ostcout, Firebee", tons: 35 }, "6": { model: "Assassin, Cicada, Clint, Hermes II, Vulcan, Whitoworth, Icarus II", tons: 40 }, "7": { model: "BlackJack, Hatchetman, Vindicator, Phoenix Hawk", tons: 45 }, "8": { model: "Centurion, Enforcer, Hunchback, Trebuchet", tons: 50 }, "9": { model: "Griffin, Shadow Hawk, Wolverine, Scorpion, Dervish, Gladiator", tons: 55 }, "10": { model: "Dragon, Ostroc, Ostsol, Rifleman, Quickdraw", tons: 60 }, "11": { model: "Catapult, Jagermech, Thunderbolt, Crusader", tons: 65 }, "12": { model: "Archer, Warhammer, Grasshopper, Battleaxe", tons: 70 }, "13": { model: "Marauder, Orion", tons: 75 }, "14": { model: "Awesome, Charger, Victor, Goliath, Zeus", tons: 80 }, "15": { model: "Battlemaster, Stalker, Longbow", tons: 85 } };

        let currentMechRoll = 0; 
        let currentCampaign = 'ELH';
        const MAX_TRAITS = 6; 

        // --- FUNCIONES DE GUARDADO Y CARGA (JSON Y CLOUD) ---
        function recogerDatosDeUI() {
            const datos = {
                campaign: document.getElementById('campaign-select').value,
                decade: document.getElementById('select-decade').value,
                year: document.getElementById('select-year-digit').value,
                nombre: document.getElementById('select-nombre').value,
                jugador: document.getElementById('select-jugador').value,
                mechMod: document.getElementById('mech-mod-select').value,
                mechRoll: currentMechRoll, 
                str: document.getElementById('select-str').value,
                dex: document.getElementById('select-dex').value,
                int: document.getElementById('select-int').value,
                cha: document.getElementById('select-cha').value,
                origen: document.getElementById('origen-select').value,
                afiliacion: document.getElementById('faction-select').value,
                estudios: document.getElementById('estudios-select').value,
                nobleSkill: document.getElementById('noble-skill-select').value,
                ageRoll: document.getElementById('select-edad-roll').value,
                altura: document.getElementById('select-altura').value,
                peso: document.getElementById('select-peso').value,
                pelo: document.getElementById('select-pelo').value,
                sexo: document.getElementById('select-sexo').value,
                ojos: document.getElementById('select-ojos').value,
                cbills: document.getElementById('gen-cbills').value,
                salary: document.getElementById('gen-salary').value,
                xpTotal: document.getElementById('gen-xp-total').value,
                xpAvail: document.getElementById('gen-xp-avail').value,
                xpBase: document.getElementById('hidden-xp-base') ? document.getElementById('hidden-xp-base').value : "",
                        merits: [], demerits: [], extraSkills: []
            };
            for(let i=1; i<=MAX_TRAITS; i++) {
                datos.merits.push(document.getElementById('merit-select-'+i).value);
                datos.demerits.push(document.getElementById('demerit-select-'+i).value);
            }
            for(let i=1; i<=3; i++) {
                datos.extraSkills.push({
                    name: document.getElementById('extra-skill-select-'+i).value,
                    level: document.getElementById('extra-skill-level-'+i).value
                });
            }
            return datos;
        }

        function rellenarUIConDatos(datos) {
            document.getElementById('campaign-select').value = datos.campaign || "ELH";
            changeCampaign();
            document.getElementById('select-decade').value = datos.decade || "2990";
            document.getElementById('select-year-digit').value = datos.year || "0";
            document.getElementById('select-nombre').value = datos.nombre || "";
            document.getElementById('select-jugador').value = datos.jugador || "";
            document.getElementById('select-str').value = datos.str || "";
            document.getElementById('select-dex').value = datos.dex || "";
            document.getElementById('select-int').value = datos.int || "";
            document.getElementById('select-cha').value = datos.cha || "";
            actualizarEstudios();

            document.getElementById('mech-mod-select').value = datos.mechMod || "0";
            currentMechRoll = datos.mechRoll || 0;
            if(currentMechRoll > 0) updateMechDisplay(); else resetMechDisplay();

            document.getElementById('origen-select').value = datos.origen || "";
            document.getElementById('faction-select').value = datos.afiliacion || "";
            document.getElementById('estudios-select').value = datos.estudios || "";
            checkEstudios();
            document.getElementById('noble-skill-select').value = datos.nobleSkill || "";
            document.getElementById('select-edad-roll').value = datos.ageRoll || "";
            document.getElementById('select-altura').value = datos.altura || "";
            document.getElementById('select-peso').value = datos.peso || "";
            document.getElementById('select-pelo').value = datos.pelo || "";
            document.getElementById('select-sexo').value = datos.sexo || "";
            document.getElementById('select-ojos').value = datos.ojos || "";
                document.getElementById('gen-cbills').value = datos.cbills || "";
            document.getElementById('gen-salary').value = datos.salary || "";
            document.getElementById('gen-xp-total').value = datos.xpTotal || "";
            document.getElementById('gen-xp-avail').value = datos.xpAvail || "";

            // Guardar xpBase en un campo oculto si existe
            if(datos.xpBase !== undefined) {
                 let hidden = document.getElementById('hidden-xp-base');
                 if(!hidden) {
                     hidden = document.createElement('input');
                     hidden.type = 'hidden';
                     hidden.id = 'hidden-xp-base';
                     document.getElementById('pre-generacion').appendChild(hidden);
                 }
                 hidden.value = datos.xpBase;
            }

            document.getElementById('campaign-status-section').style.display = 'block';

            for(let i=0; i<MAX_TRAITS; i++) {
                let idx = i+1;
                document.getElementById('merit-select-'+idx).value = (datos.merits && datos.merits[i]) || "";
                document.getElementById('demerit-select-'+idx).value = (datos.demerits && datos.demerits[i]) || "";
            }
            actualizarSlotsHabilidades();
            rellenarSelectoresCompra();
            for(let i=0; i<3; i++) {
                let idx = i+1;
                if (datos.extraSkills && datos.extraSkills[i]) {
                    document.getElementById('extra-skill-select-'+idx).value = datos.extraSkills[i].name || "";
                    document.getElementById('extra-skill-level-'+idx).value = datos.extraSkills[i].level || "";
                }
            }
            updatePoints();
                // Si estamos en el editor de ficha, rellenar también los campos de la ficha
            const fichaVisible = document.getElementById('ficha-container').style.display !== 'none';
            if(fichaVisible) {
                rellenarCamposFichaDesdeGenerador();
            }
                // Rellenar campos de Barracones si existen
            rellenarBarraconesDesdeGenerador(datos);
        }

        /**
         * Rellena los campos de Barracones con datos del generador
         * y genera el estado físico basándose en FUE
         * @param {Object} datos - Datos del personaje
         */
        function rellenarBarraconesDesdeGenerador(datos) {
            // Usar la función completa de carga
            cargarPersonajeEnBarracones(datos);
        }
        /**
         * Genera dinámicamente la tabla de habilidades combinando estudios y extraSkills
         * @param {string} estudios - Nivel de estudios del personaje
         * @param {string} nobleSkill - Habilidad noble si aplica
         * @param {Array} extraSkills - Array de {name, level} adicionales
         */
        function generarHabilidadesBarracones(estudios, nobleSkill, extraSkills) {
            const table = document.getElementById('barr-skills-table');
            if (!table) return;
                // Limpiar tabla (mantener solo header)
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
                // Obtener habilidades base del nivel de estudios
            const baseSkills = getSkillsFromStudy(estudios || "", nobleSkill || "");
                // Crear mapa de habilidades: nombre → nivel
            const skillsMap = {};
                // Añadir habilidades base del estudio
            baseSkills.forEach(skill => {
                if (skill.n && skill.v) {
                    skillsMap[skill.n] = parseInt(skill.v) || 0;
                }
            });
                // Añadir/combinar habilidades extra (pueden sobrescribir o sumar)
            if (extraSkills && Array.isArray(extraSkills)) {
                extraSkills.forEach(skill => {
                    if (skill.name && skill.level) {
                        const currentLevel = skillsMap[skill.name] || 0;
                        const newLevel = parseInt(skill.level) || 0;
                        // Usar el nivel mayor entre base y extra
                        skillsMap[skill.name] = Math.max(currentLevel, newLevel);
                    }
                });
            }
                // Convertir mapa a array y ordenar alfabéticamente
            const allSkills = Object.entries(skillsMap)
                .map(([name, level]) => ({ name, level }))
                .sort((a, b) => a.name.localeCompare(b.name));
                // Generar fila por cada habilidad
            allSkills.forEach((skill, index) => {
                const row = table.insertRow(-1);
                        // Columna 1: Nombre de habilidad
                const cellName = row.insertCell(0);
                cellName.textContent = skill.name;
                        // Columna 2: Nivel (editable)
                const cellNv = row.insertCell(1);
                const inputNv = document.createElement('input');
                inputNv.type = 'number';
                inputNv.id = 'barr-skill-' + index + '-nv';
                inputNv.value = skill.level;
                inputNv.onchange = calcularTIRBarracones;
                cellNv.appendChild(inputNv);
                        // Columna 3: TIR (readonly, calculado)
                const cellTir = row.insertCell(2);
                const inputTir = document.createElement('input');
                inputTir.type = 'number';
                inputTir.id = 'barr-skill-' + index + '-tir';
                inputTir.readOnly = true;
                inputTir.style.background = 'transparent';
                inputTir.style.color = '#00ff41';
                cellTir.appendChild(inputTir);
                        // Columna 4: Cuadrados de mejora (4 en cuadrícula 2x2)
                const cellUpgrades = row.insertCell(3);
                const upgradesContainer = document.createElement('div');
                upgradesContainer.className = 'barracones-skill-upgrades';
                upgradesContainer.id = 'barr-skill-' + index + '-upgrades';
                        // Crear 4 cuadrados
                for (let i = 0; i < 4; i++) {
                    const upgrade = document.createElement('div');
                    upgrade.className = 'barracones-skill-upgrade';
                    upgrade.onclick = () => toggleSkillUpgrade(upgrade, 'barr-skill-' + index + '-nv');
                    upgradesContainer.appendChild(upgrade);
                }
                        cellUpgrades.appendChild(upgradesContainer);
            });
        }
        /**
         * Calcula TIR para todas las habilidades
         * TIR = ((FUE + DES + INT + CAR) / 4) - Nivel de habilidad
         */
        function calcularTIRBarracones() {
            // Obtener atributos base
            const fue = parseInt(document.getElementById('barr-fue')?.value) || 0;
            const des = parseInt(document.getElementById('barr-des')?.value) || 0;
            const int = parseInt(document.getElementById('barr-int')?.value) || 0;
            const car = parseInt(document.getElementById('barr-car')?.value) || 0;
                // Calcular promedio de atributos
            const promedioAtributos = (fue + des + int + car) / 4;
                // Buscar todos los inputs de nivel y TIR
            const table = document.getElementById('barr-skills-table');
            if (!table) return;
                // Iterar sobre todas las filas (excepto el header)
            for (let i = 1; i < table.rows.length; i++) {
                const nvInput = document.getElementById('barr-skill-' + (i-1) + '-nv');
                const tirInput = document.getElementById('barr-skill-' + (i-1) + '-tir');
                        if (nvInput && tirInput) {
                    const nivel = parseInt(nvInput.value) || 0;
                    const tir = Math.round(promedioAtributos - nivel);
                    tirInput.value = tir;
                }
            }
        }
        /**
         * Toggle cuadrado de mejora de atributo
         * Solo permite seleccionar en orden (1, 2) y deseleccionar en orden inverso (2, 1)
         * @param {HTMLElement} square - El cuadrado clickeado
         * @param {string} attrId - ID del input de atributo (ej: 'barr-fue')
         */
        /**
         * Toggle cuadrado de mejora de habilidad
         * Solo permite seleccionar en orden (1-4) y deseleccionar en orden inverso (4-1)
         * @param {HTMLElement} square - El cuadrado clickeado
         * @param {string} skillNvId - ID del input de nivel de habilidad (ej: 'barr-skill-0-nv')
         */

        // ============================================================================
        // SISTEMA DE EXPERIENCIA (XP) - BARRACONES
        // ============================================================================

        /**
         * Tablas de costos de XP
         */
        // Variable para trackear si se ha gastado XP esta sesión
        let xpGastadoEstaSesion = false;
        
        const XP_COSTS = {
            // Costo de subir atributos [valorDestino][atributo]
            atributos: {
                6: { fue: 0, des: 0, int: 0, cha: 0 },
                7: { fue: 1000, des: 1500, int: 2000, cha: 1000 },
                8: { fue: 3000, des: 4500, int: 6000, cha: 3000 },
                9: { fue: 7000, des: 9500, int: 12000, cha: 7000 },
                10: { fue: 15000, des: 19500, int: 24500, cha: 15000 },
                11: { fue: 30000, des: 39500, int: 49500, cha: 30000 },
                12: { fue: 60000, des: 79500, int: 99500, cha: 60000 }
            },
    
            // Costo de subir habilidades [nivelDestino]
            habilidades: {
                0: 0,
                1: 750,
                2: 1750,
                3: 2500,
                4: 3500,
                5: 5000,
                6: 7000,
                7: 10000,
                8: 14000,
                9: 19000
            },
    
            // Umbrales de nivel de veteranía
            veterania: [
                { min: 0, max: 5000, nombre: 'Novato', upgradesPermitidos: 0 },
                { min: 5001, max: 30000, nombre: 'Regular', upgradesPermitidos: 1 },
                { min: 30001, max: 65000, nombre: 'Veterano', upgradesPermitidos: 2 },
                { min: 65001, max: 100000, nombre: 'Elite', upgradesPermitidos: 3 },
                { min: 100001, max: Infinity, nombre: 'As', upgradesPermitidos: 4 }
            ]
        };

        /**
         * Lista completa de habilidades disponibles
         */
        const HABILIDADES_DISPONIBLES = [
            "Admin. de Feudo", "Arco", "Astronavegación", "Comercio", "Demoliciones",
            "Diplomacia", "Disparo Mech", "Equitación", "Espada", "Etiqueta",
            "Falsificación", "Física", "Furtividad", "Historia", "Hurto",
            "Idioma", "Informática", "Ingeniería", "Interrogatorio", "Intimidación",
            "Investigación", "Liderazgo", "Matemáticas", "Mecánica", "Medicina",
            "Navegación", "Negociación", "Orientación", "Percepción", "Persuasión",
            "Pilotar Aeronave", "Pilotar Mech", "Pilotar Vehículo", "Pistola",
            "Primeros Auxilios", "Rastreo", "Rifle", "Supervivencia", "Tácticas",
            "Técnica Mech", "Thrown Weapons"
        ];

        /**
         * Calcula el nivel de veteranía basado en XP total
         */
        function calcularNivelVeterania(xpTotal) {
            for (const nivel of XP_COSTS.veterania) {
                if (xpTotal >= nivel.min && xpTotal <= nivel.max) {
                    return nivel;
                }
            }
            return XP_COSTS.veterania[0];
        }

        /**
         * Actualiza el display de XP y nivel de veteranía
         */
        function actualizarDisplayXP() {
            const xpTotal = parseInt(document.getElementById('barr-xp-total')?.value) || 0;
            const nivelVeterania = calcularNivelVeterania(xpTotal);
    
            const rangoInput = document.getElementById('barr-rango');
            if (rangoInput) {
                rangoInput.value = nivelVeterania.nombre.toUpperCase();
            }
    
            actualizarBotonAñadirHabilidad();
        }

        /**
         * Actualiza la visibilidad del botón naranja de habilidades.
         * Se muestra solo si numHabilidades < INT.
         * El botón verde de quirk siempre está visible (permanente en el HTML).
         */
        function actualizarBotonAñadirHabilidad() {
            const intValue = parseInt(document.getElementById('barr-int')?.value) || 0;
            const table = document.getElementById('barr-skills-table');
            const numHabilidades = table ? table.rows.length - 1 : 0;
            const btnAdd = document.getElementById('btn-add-skill');
            if (btnAdd) {
                btnAdd.style.display = (numHabilidades < intValue && intValue > 0) ? 'block' : 'none';
                // Restaurar estilo naranja siempre
                btnAdd.style.background = 'rgba(255,174,0,0.2)';
                btnAdd.style.borderColor = '#ffae00';
                btnAdd.style.color = '#ffae00';
                btnAdd.onclick = function() { abrirPopupHabilidad(); };
            }
        }

        /** Obtiene el nombre del jugador cargado actualmente en Barracones */
        function _obtenerJugadorActual() {
            return document.getElementById('barr-callsign')?.value || '';
        }

        /**
         * Consume XP y actualiza el display
         */
        function consumirXP(cantidad) {
            const inputDisponible = document.getElementById('barr-xp-disponible');
            if (!inputDisponible) return false;
    
            const xpDisponible = parseInt(inputDisponible.value) || 0;
    
            if (xpDisponible < cantidad) {
                alert(`❌ XP INSUFICIENTE\n\nNecesitas: ${cantidad} XP\nDisponibles: ${xpDisponible} XP\nFaltante: ${cantidad - xpDisponible} XP`);
                return false;
            }
    
            inputDisponible.value = xpDisponible - cantidad;
            actualizarDisplayXP();
            return true;
        }

        /**
         * Devuelve XP cuando se desmarca una mejora
         */
        function devolverXP(cantidad) {
            const inputDisponible = document.getElementById('barr-xp-disponible');
            if (!inputDisponible) return;
    
            const xpDisponible = parseInt(inputDisponible.value) || 0;
            inputDisponible.value = xpDisponible + cantidad;
            actualizarDisplayXP();
        }

// ============================================================================
// REGISTRO DE GASTOS EN LA NUBE
// ============================================================================

/**
 * Registra un gasto de XP en Google Sheets
 */
async function registrarGastoXPEnNube(jugador, cantidad, descripcion) {
    try {
        // Usar GET con parámetros igual que registrarMision
        const params = new URLSearchParams({
            action: 'registrarGastoXP',
            jugador: jugador,
            cantidad: cantidad,
            descripcion: descripcion
        });
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            console.log('✅ Gasto XP registrado:', descripcion, '-', cantidad, 'XP');
        } else {
            console.error('❌ Error al registrar gasto:', data.msg);
        }
    } catch (error) {
        console.error('❌ Error al registrar gasto:', error);
    }
}

/**
 * Registra una compra de mejora en "Respuestas de formulario 1"
 * Formato: Fecha/Hora | -XP Exp | | | | | | +1 STAT | Subidas
 */
async function registrarMejoraEnFormulario(jugador, xpGastado, tipo, nombre, nivelAnterior, nivelNuevo) {
    try {
        const ahora = new Date();
        const fecha = ahora.toLocaleDateString('es-ES');
        const hora = ahora.toLocaleTimeString('es-ES');
        const fechaHora = `${fecha} ${hora}`;
        
        // Formato: '+1 FUE o '+1 Arco (con ' para que Sheets lo trate como texto)
        const descripcionMejora = `'+${nivelNuevo - nivelAnterior} ${nombre}`;
        
        const params = new URLSearchParams({
            action: 'registrarMejora',
            jugador: jugador,
            fechaHora: fechaHora,
            xpGastado: `-${xpGastado} Exp`,
            mejora: descripcionMejora,
            tipo: 'Subidas'
        });
        
        console.log('📤 Enviando mejora al servidor:', params.toString());
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            console.log('✅ Mejora registrada en formulario:', descripcionMejora);
        } else {
            console.error('❌ Error al registrar mejora:', data.msg);
        }
    } catch (error) {
        console.error('❌ Error al registrar mejora:', error);
    }
}

/**
 * Registra la reversión de una mejora en "Respuestas de formulario 1"
 * Crea una línea contraria: +XP Exp | '-1 STAT | Reversion
 */
async function registrarReversionEnFormulario(jugador, xpDevuelto, tipo, nombre, nivelNuevo, nivelAnterior) {
    try {
        const ahora = new Date();
        const fecha = ahora.toLocaleDateString('es-ES');
        const hora = ahora.toLocaleTimeString('es-ES');
        const fechaHora = `${fecha} ${hora}`;
        
        // Formato: '-1 FUE o '-1 Arco (con ' para que Sheets lo trate como texto)
        const descripcionReversion = `'-1 ${nombre}`;
        
        const params = new URLSearchParams({
            action: 'registrarMejora',
            jugador: jugador,
            fechaHora: fechaHora,
            xpGastado: `+${xpDevuelto} Exp`,  // Positivo porque se devuelve
            mejora: descripcionReversion,
            tipo: 'Reversion'
        });
        
        console.log('📤 Enviando reversión al servidor:', params.toString());
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            console.log('✅ Reversión registrada en formulario:', descripcionReversion);
        } else {
            console.error('❌ Error al registrar reversión:', data.msg);
        }
    } catch (error) {
        console.error('❌ Error al registrar reversión:', error);
    }
}

/**
 * Registra la reversión de una mejora en "Respuestas de formulario 1"
 * Crea una línea contraria: +XP Exp | -1 STAT | Reversion
 */
async function registrarReversionMejoraEnFormulario(jugador, xpDevuelto, tipo, nombre, nivelAnterior, nivelNuevo) {
    try {
        const ahora = new Date();
        const fecha = ahora.toLocaleDateString('es-ES');
        const hora = ahora.toLocaleTimeString('es-ES');
        const fechaHora = `${fecha} ${hora}`;
        
        // Formato: '-1 FUE (con ' para que Sheets lo trate como texto)
        const descripcionReversion = `'-${nivelNuevo - nivelAnterior} ${nombre}`;
        
        const params = new URLSearchParams({
            action: 'registrarMejora',
            jugador: jugador,
            fechaHora: fechaHora,
            xpGastado: `+${xpDevuelto} Exp`,  // Positivo porque se devuelve
            mejora: descripcionReversion,
            tipo: 'Reversion'
        });
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            console.log('✅ Reversión registrada en formulario:', descripcionReversion);
        } else {
            console.error('❌ Error al registrar reversión:', data.msg);
        }
    } catch (error) {
        console.error('❌ Error al registrar reversión:', error);
    }
}


        /**
         * Actualiza los estilos hover de los cuadrados de upgrade
         */
        function actualizarHoverUpgrades() {
            const xpTotal = parseInt(document.getElementById('barr-xp-total')?.value) || 0;
            const nivelVeterania = calcularNivelVeterania(xpTotal);
    
            // Atributos
            document.querySelectorAll('.barracones-attr-upgrades').forEach(container => {
                const squares = Array.from(container.querySelectorAll('.barracones-attr-upgrade'));
                const selectedCount = squares.filter(sq => sq.classList.contains('selected')).length;
                squares.forEach((sq, index) => {
                    // Remover listeners anteriores
                    sq.onmouseover = null;
                    sq.onmouseout = null;
                        const isUsed = sq.classList.contains('used-this-rank');
                    const isNextInLine = index === selectedCount;
                        if (isUsed) {
                        // Rojo - ya usado en este rango
                        sq.onmouseover = () => {
                            sq.style.borderColor = '#ff4444';
                            sq.style.boxShadow = '0 0 10px rgba(255,68,68,0.5)';
                        };
                        sq.onmouseout = () => {
                            sq.style.borderColor = '';
                            sq.style.boxShadow = '';
                        };
                    } else if (isNextInLine && selectedCount < nivelVeterania.upgradesPermitidos) {
                        // Naranja - disponible
                        sq.onmouseover = () => {
                            sq.style.borderColor = '#ffae00';
                            sq.style.boxShadow = '0 0 10px rgba(255,174,0,0.5)';
                        };
                        sq.onmouseout = () => {
                            sq.style.borderColor = '';
                            sq.style.boxShadow = '';
                        };
                    }
                });
            });
    
            // Habilidades
            document.querySelectorAll('.barracones-skill-upgrades').forEach(container => {
                const squares = Array.from(container.querySelectorAll('.barracones-skill-upgrade'));
                const selectedCount = squares.filter(sq => sq.classList.contains('selected')).length;
                squares.forEach((sq, index) => {
                    sq.onmouseover = null;
                    sq.onmouseout = null;
                        const isUsed = sq.classList.contains('used-this-rank');
                    const isNextInLine = index === selectedCount;
                        if (isUsed) {
                        sq.onmouseover = () => {
                            sq.style.borderColor = '#ff4444';
                            sq.style.boxShadow = '0 0 10px rgba(255,68,68,0.5)';
                        };
                        sq.onmouseout = () => {
                            sq.style.borderColor = '';
                            sq.style.boxShadow = '';
                        };
                    } else if (isNextInLine && selectedCount < nivelVeterania.upgradesPermitidos) {
                        sq.onmouseover = () => {
                            sq.style.borderColor = '#ffae00';
                            sq.style.boxShadow = '0 0 10px rgba(255,174,0,0.5)';
                        };
                        sq.onmouseout = () => {
                            sq.style.borderColor = '';
                            sq.style.boxShadow = '';
                        };
                    }
                });
            });
        }

        /**
         * REEMPLAZA toggleAttrUpgrade ORIGINAL
         * Toggle de atributo con sistema de XP
         */
        function toggleAttrUpgrade(square, attrId) {
    // Verificar si el cuadrado está bloqueado (cargado de sesión anterior)
    if (square.classList.contains('locked')) {
        console.log('⛔ Cuadrado bloqueado - no se puede deseleccionar');
        return;
    }
    
    // attrId viene como 'barr-fue', 'barr-des', etc.
    const atributoKey = attrId.replace('barr-', ''); // 'fue', 'des', 'int', 'car'
    const atributoDisplay = atributoKey.toUpperCase(); // 'FUE', 'DES', etc.
    const attrInput = document.getElementById(attrId);
    const baseValue = parseInt(attrInput.value) || 6;
    
    // Contar cuántos cuadrados están marcados para este atributo
    const container = square.parentElement;
    const allSquares = Array.from(container.querySelectorAll('.barracones-attr-upgrade'));
    const squareIndex = allSquares.indexOf(square);
    const marcados = container.querySelectorAll('.barracones-attr-upgrade.selected').length;
    
    const estaActivo = square.classList.contains('selected');
    
    // El nivel destino es baseValue + posición del cuadrado + 1
    const nivelDestino = baseValue + squareIndex + 1;
    const nivelActual = baseValue + squareIndex;
    
    // Obtener costo de la tabla: XP_COSTS.atributos[nivelDestino][atributoKey]
    const costo = XP_COSTS.atributos[nivelDestino] ? (XP_COSTS.atributos[nivelDestino][atributoKey] || 0) : 0;
    const jugador = document.getElementById('barr-callsign')?.value || 'Desconocido';
    
    console.log(`Toggle Atributo: ${atributoDisplay}, base=${baseValue}, destino=${nivelDestino}, costo=${costo}`);
    
    if (estaActivo) {
        // DESELECCIONAR - devolver XP y revertir
        square.classList.remove('selected');
        devolverXP(costo);
        
        // Restar 1 al valor del atributo
        attrInput.value = parseInt(attrInput.value) - 1;
        attrInput.dispatchEvent(new Event('change'));
        
        // Eliminar del historial de sesión
        const compraIndex = historialCompras.findIndex(c => c.square === square);
        if (compraIndex !== -1) {
            historialCompras.splice(compraIndex, 1);
            actualizarVistaHistorial();
        }
        
        // Regenerar HP si era FUE
        if (atributoKey === 'fue') {
            generarEstadoFisicoBarracones(parseInt(attrInput.value));
        }
        
        console.log(`⏪ Deseleccionado: ${atributoDisplay}, devuelto ${costo} XP`);
    } else {
        // SELECCIONAR - gastar XP
        if (consumirXP(costo)) {
            square.classList.add('selected');
            // Marcar que se gastó XP esta sesión
            xpGastadoEstaSesion = true;
            // Sumar 1 al valor del atributo
            attrInput.value = parseInt(attrInput.value) + 1;
            attrInput.dispatchEvent(new Event('change'));
            
            // REGISTRAR EN HISTORIAL
            registrarCompra(jugador, 'atributo', atributoDisplay, baseValue, baseValue + 1, costo, square);
            
            // Regenerar HP si era FUE
            if (atributoKey === 'fue') {
                generarEstadoFisicoBarracones(parseInt(attrInput.value));
            }
        }
    }
    
    actualizarHoverUpgrades();
}

        /**
         * REEMPLAZA toggleSkillUpgrade ORIGINAL
         * Toggle de habilidad con sistema de XP
         */
        function toggleSkillUpgrade(square, skillBaseId) {
    // Verificar si el cuadrado está bloqueado (cargado de sesión anterior)
    if (square.classList.contains('locked')) {
        console.log('⛔ Cuadrado bloqueado - no se puede deseleccionar');
        return;
    }
    
    // skillBaseId viene como 'barr-skill-X-nv' donde X es el índice
    const match = skillBaseId.match(/barr-skill-(\d+)-nv/);
    if (!match) {
        console.error('ID de habilidad inválido:', skillBaseId);
        return;
    }
    
    const skillIndex = match[1];
    const nivelInputId = 'barr-skill-' + skillIndex + '-nv';
    const nivelInput = document.getElementById(nivelInputId);
    const baseLevel = parseInt(nivelInput?.value) || 0;
    
    // Encontrar el contenedor y posición del cuadrado
    const container = square.parentElement;
    const allSquares = Array.from(container.querySelectorAll('.barracones-skill-upgrade'));
    const squareIndex = allSquares.indexOf(square);
    
    const estaActivo = square.classList.contains('selected');
    
    // El nivel destino es baseLevel + posición del cuadrado + 1
    const nivelDestino = baseLevel + squareIndex + 1;
    const nivelActual = baseLevel + squareIndex;
    
    // Obtener costo de la tabla: XP_COSTS.habilidades[nivelDestino]
    const costo = XP_COSTS.habilidades[nivelDestino] || 0;
    const jugador = document.getElementById('barr-callsign')?.value || 'Desconocido';
    
    // Obtener nombre de la habilidad (está en la primera celda de la fila)
    const row = container.closest('tr');
    const nombreHabilidad = row?.cells[0]?.textContent || 'Habilidad';
    
    console.log(`Toggle Habilidad: ${nombreHabilidad}, base=${baseLevel}, destino=${nivelDestino}, costo=${costo}`);
    
    if (estaActivo) {
        // DESELECCIONAR - devolver XP y revertir
        square.classList.remove('selected');
        devolverXP(costo);
        
        // Restar 1 al nivel de la habilidad
        if (nivelInput) {
            nivelInput.value = parseInt(nivelInput.value) - 1;
            nivelInput.dispatchEvent(new Event('change'));
        }
        
        // Eliminar del historial de sesión
        const compraIndex = historialCompras.findIndex(c => c.square === square);
        if (compraIndex !== -1) {
            historialCompras.splice(compraIndex, 1);
            actualizarVistaHistorial();
        }
        
        // Recalcular TIR
        calcularTIRBarracones();
        
        console.log(`⏪ Deseleccionado: ${nombreHabilidad}, devuelto ${costo} XP`);
    } else {
        // SELECCIONAR - gastar XP
        if (consumirXP(costo)) {
            square.classList.add('selected');
            // Marcar que se gastó XP esta sesión
            xpGastadoEstaSesion = true;
            // Sumar 1 al nivel de la habilidad
            if (nivelInput) {
                nivelInput.value = parseInt(nivelInput.value) + 1;
                nivelInput.dispatchEvent(new Event('change'));
            }
            
            // REGISTRAR EN HISTORIAL
            registrarCompra(jugador, 'habilidad', nombreHabilidad, baseLevel, baseLevel + 1, costo, square);
            
            // Recalcular TIR
            calcularTIRBarracones();
        }
    }
    
    actualizarHoverUpgrades();
}

        // ============================================================================
        // POPUP DE SELECCIÓN DE HABILIDADES
        // ============================================================================

        function abrirPopupHabilidad() {
            const xpDisponible = parseInt(document.getElementById('barr-xp-disponible')?.value) || 0;
            const costoMinimo = XP_COSTS.habilidades[1];
    
            if (xpDisponible < costoMinimo) {
                alert(`❌ XP INSUFICIENTE\n\nNecesitas al menos ${costoMinimo} XP para adquirir una nueva habilidad.\nDisponibles: ${xpDisponible} XP`);
                return;
            }
    
            const table = document.getElementById('barr-skills-table');
            const habilidadesActuales = [];
    
            if (table) {
                for (let i = 1; i < table.rows.length; i++) {
                    const skillName = table.rows[i].cells[0]?.textContent;
                    if (skillName) habilidadesActuales.push(skillName);
                }
            }
    
            const habilidadesDisponibles = HABILIDADES_DISPONIBLES.filter(
                h => !habilidadesActuales.includes(h)
            );
    
            const popup = document.getElementById('popup-seleccion-habilidad');
            const lista = document.getElementById('lista-habilidades-disponibles');
            const mensaje = document.getElementById('mensaje-sin-habilidades');
    
            if (!popup || !lista || !mensaje) return;
    
            lista.innerHTML = '';
    
            if (habilidadesDisponibles.length === 0) {
                mensaje.style.display = 'block';
                lista.style.display = 'none';
            } else {
                mensaje.style.display = 'none';
                lista.style.display = 'grid';
                habilidadesDisponibles.forEach(habilidad => {
                    const btn = document.createElement('button');
                    btn.textContent = habilidad;
                    btn.style.cssText = `
                        background:rgba(255,174,0,0.1);
                        border:1px solid #ffae00;
                        color:#ffae00;
                        font-family:'Share Tech Mono',monospace;
                        padding:15px;
                        cursor:pointer;
                        transition:all 0.3s;
                        text-align:left;
                        font-size:0.9em;
                    `;
                    btn.onmouseover = () => {
                        btn.style.background='rgba(255,174,0,0.3)';
                        btn.style.borderColor='#ffc850';
                    };
                    btn.onmouseout = () => {
                        btn.style.background='rgba(255,174,0,0.1)';
                        btn.style.borderColor='#ffae00';
                    };
                    btn.onclick = () => seleccionarHabilidad(habilidad);
                    lista.appendChild(btn);
                });
            }
    
            popup.style.display = 'block';
        }

        function cerrarPopupHabilidad() {
            const popup = document.getElementById('popup-seleccion-habilidad');
            if (popup) popup.style.display = 'none';
        }

        function seleccionarHabilidad(nombreHabilidad) {
            const costoInicial = XP_COSTS.habilidades[1];
    
            if (!consumirXP(costoInicial)) return;
    
            const table = document.getElementById('barr-skills-table');
            if (!table) return;
    
            const skillIndex = table.rows.length - 1;
            const row = table.insertRow(-1);
    
            // Nombre
            const cellName = row.insertCell(0);
            cellName.textContent = nombreHabilidad;
    
            // Nivel
            const cellNv = row.insertCell(1);
            const inputNv = document.createElement('input');
            inputNv.type = 'number';
            inputNv.id = 'barr-skill-' + skillIndex + '-nv';
            inputNv.value = 1;
            inputNv.onchange = calcularTIRBarracones;
            cellNv.appendChild(inputNv);
    
            // TIR
            const cellTir = row.insertCell(2);
            const inputTir = document.createElement('input');
            inputTir.type = 'number';
            inputTir.id = 'barr-skill-' + skillIndex + '-tir';
            inputTir.readOnly = true;
            inputTir.style.background = 'transparent';
            inputTir.style.color = '#00ff41';
            cellTir.appendChild(inputTir);
    
            // Upgrades
            const cellUpgrades = row.insertCell(3);
            const upgradesContainer = document.createElement('div');
            upgradesContainer.className = 'barracones-skill-upgrades';
            upgradesContainer.id = 'barr-skill-' + skillIndex + '-upgrades';
    
            for (let i = 0; i < 4; i++) {
                const upgrade = document.createElement('div');
                upgrade.className = 'barracones-skill-upgrade';
                if (i === 0) {
                    upgrade.classList.add('selected');
                    upgrade.classList.add('used-this-rank');
                }
                upgrade.onclick = () => toggleSkillUpgrade(upgrade, 'barr-skill-' + skillIndex + '-nv');
                upgradesContainer.appendChild(upgrade);
            }
    
            cellUpgrades.appendChild(upgradesContainer);
    
            calcularTIRBarracones();
            actualizarBotonAñadirHabilidad();
            actualizarHoverUpgrades();
            cerrarPopupHabilidad();
    
            alert(`✅ HABILIDAD ADQUIRIDA\n\n${nombreHabilidad} - Nivel 1\n\nCosto: ${costoInicial} XP`);
        }

        // ============================================================================
        // INICIALIZACIÓN
        // ============================================================================

        // Llamar cuando se carga un personaje o se cambia XP
        function inicializarSistemaXP() {
            actualizarDisplayXP();
            actualizarHoverUpgrades();
        }


        /**
         * Genera el estado físico (cuadrados de HP) basándose en FUE
         * @param {number} fue - Valor de FUE del personaje
         * 
         * LÓGICA:
         * - Cabeza = FUE
         * - Torso = FUE x3
         * - Brazos = FUE x2 (redondeo a la baja)
         * - Piernas = FUE x2 (redondeo a la alta)
         */
        /**
         * Genera los cuadrados de estado físico (HP) basados en el atributo FUE
         * 
         * Esta función crea dinámicamente los cuadrados HP para cada localización del cuerpo.
         * El número de cuadrados depende del valor de FUE según fórmulas específicas.
         * 
         * FÓRMULAS DE HP POR LOCALIZACIÓN:
         * - CABEZA: FUE × 1 (ej: FUE=5 → 5 HP)
         * - TORSO: FUE × 3 (ej: FUE=5 → 15 HP) 
         * - BRAZOS: floor(FUE × 2) (ej: FUE=5 → 10 HP, FUE=3 → 6 HP)
         * - PIERNAS: ceil(FUE × 2) (ej: FUE=5 → 10 HP, FUE=3 → 6 HP)
         * 
         * NOTA SOBRE REDONDEO:
         * - Brazos usan floor() (hacia abajo) para balancear con piernas
         * - Piernas usan ceil() (hacia arriba) por ser localizaciones más resistentes
         * - Esto asegura distribución justa cuando FUE es impar
         * 
         * TIPOS DE CUADRADOS:
         * - 'barracones-hp-segment': Para CABEZA y TORSO (visualización horizontal)
         * - 'barracones-hp-segment-vertical': Para BRAZOS y PIERNAS (vertical)
         * 
         * INTERACTIVIDAD:
         * Cada cuadrado tiene onclick=toggleHPSegment para marcar daño (verde→rojo)
         * 
         * @param {number} fue - Valor del atributo Fuerza (FUE)
         * 
         * @returns {void}
         * 
         * @example
         * // Con FUE=5
         * generarEstadoFisicoBarracones(5);
         * // Genera: Cabeza=5, Torso=15, Brazos=10, Piernas=10 (Total: 40 HP)
         * 
         * @example
         * // Con FUE=3 (impar)
         * generarEstadoFisicoBarracones(3);
         * // Genera: Cabeza=3, Torso=9, Brazos=6 (floor), Piernas=6 (ceil) (Total: 24 HP)
         * 
         * @see toggleHPSegment() - Función que maneja el click en cuadrados
         * @see restaurarEstadoFisico() - Función que restaura daños guardados
         */
        function generarEstadoFisicoBarracones(fue) {
            console.log(`💔 Generando estado físico con FUE=${fue}...`);
                // === CALCULAR HP POR LOCALIZACIÓN ===
            // Fórmulas basadas en el sistema de reglas de MechWarrior
            const hpCabeza = fue;                    // Cabeza: 1× FUE
            const hpTorso = fue * 3;                 // Torso: 3× FUE (zona más resistente)
            const hpBrazos = Math.floor(fue * 2);    // Brazos: 2× FUE (redondeo hacia abajo)
            const hpPiernas = Math.ceil(fue * 2);    // Piernas: 2× FUE (redondeo hacia arriba)
                console.log(`  📊 HP calculados:`);
            console.log(`     - Cabeza: ${hpCabeza}`);
            console.log(`     - Torso: ${hpTorso}`);
            console.log(`     - Brazos: ${hpBrazos} (cada uno)`);
            console.log(`     - Piernas: ${hpPiernas} (cada una)`);
            console.log(`     - TOTAL: ${hpCabeza + hpTorso + (hpBrazos * 2) + (hpPiernas * 2)} HP`);
                // === ENCONTRAR CONTENEDORES DE LOCALIZACIONES ===
            // Buscar todas las cajas de localizaciones en el HTML
            const localizaciones = document.querySelectorAll('.barracones-loc-box');
                if (localizaciones.length === 0) {
                console.error('❌ No se encontraron contenedores de localizaciones (.barracones-loc-box)');
                return;
            }
                console.log(`  📦 Encontrados ${localizaciones.length} contenedores de localizaciones`);
                // === GENERAR CUADRADOS PARA CADA LOCALIZACIÓN ===
            localizaciones.forEach((loc, index) => {
                try {
                    // Obtener el nombre de la localización (CABEZA, TORSO, etc.)
                    const nombreElement = loc.querySelector('.barracones-loc-name');
                    if (!nombreElement) {
                        console.warn(`  ⚠️ Localización ${index} sin nombre`);
                        return;
                    }
                                const nombre = nombreElement.textContent.trim();
                    let hp = 0;
                                // === DETERMINAR HP SEGÚN LOCALIZACIÓN ===
                    switch(nombre) {
                        case 'CABEZA':
                            hp = hpCabeza;
                            break;
                        case 'TORSO':
                            hp = hpTorso;
                            break;
                        case 'B.IZQ':   // Brazo Izquierdo
                        case 'B.DER':   // Brazo Derecho
                            hp = hpBrazos;
                            break;
                        case 'P.IZQ':   // Pierna Izquierda
                        case 'P.DER':   // Pierna Derecha
                            hp = hpPiernas;
                            break;
                        default:
                            console.warn(`  ⚠️ Localización desconocida: ${nombre}`);
                            return;
                    }
                                // === BUSCAR CONTENEDOR DE CUADRADOS HP ===
                    // El contenedor es el div que NO tiene la clase 'barracones-loc-name'
                    const contenedor = loc.querySelector('div:not(.barracones-loc-name)');
                    if (!contenedor) {
                        console.warn(`  ⚠️ ${nombre}: No se encontró contenedor de HP`);
                        return;
                    }
                                // Limpiar cualquier cuadrado existente
                    contenedor.innerHTML = '';
                                // === GENERAR CUADRADOS SEGÚN TIPO DE LOCALIZACIÓN ===
                    if (nombre === 'CABEZA') {
                        // CABEZA: Grid horizontal compacto (2 columnas máximo)
                        for (let i = 0; i < hp; i++) {
                            const segment = document.createElement('span');
                            segment.className = 'barracones-hp-segment';  // Clase horizontal
                            segment.onclick = toggleHPSegment;            // Hacer clickeable
                            contenedor.appendChild(segment);
                        }
                        console.log(`    ✅ ${nombre}: ${hp} cuadrados (horizontal)`);
                                    } else if (nombre === 'TORSO') {
                        // TORSO: Grid de 3 columnas
                        for (let i = 0; i < hp; i++) {
                            const segment = document.createElement('span');
                            segment.className = 'barracones-hp-segment';  // Clase horizontal
                            segment.onclick = toggleHPSegment;
                            contenedor.appendChild(segment);
                        }
                        console.log(`    ✅ ${nombre}: ${hp} cuadrados (horizontal)`);
                                    } else {
                        // BRAZOS Y PIERNAS: Grid de 2 columnas (vertical)
                        for (let i = 0; i < hp; i++) {
                            const segment = document.createElement('span');
                            segment.className = 'barracones-hp-segment-vertical';  // Clase vertical
                            segment.onclick = toggleHPSegment;
                            contenedor.appendChild(segment);
                        }
                        console.log(`    ✅ ${nombre}: ${hp} cuadrados (vertical)`);
                    }
                            } catch (error) {
                    console.error(`  ❌ Error al generar ${nombre}:`, error);
                }
            });
                console.log('✅ Estado físico generado completamente');
        }
        /**
         * Alterna el estado de un cuadrado de HP entre sano (verde) y dañado (rojo)
         * 
         * Esta función se ejecuta cuando el usuario hace click en un cuadrado HP.
         * Añade o quita la clase 'damaged' que cambia el color visual del cuadrado.
         * 
         * @param {Event} event - Evento de click del navegador
         * @returns {void}
         * 
         * @example
         * // El usuario hace click en un cuadrado verde
         * // → Se añade clase 'damaged' → Cuadrado se pone rojo
         * // 
         * // El usuario hace click nuevamente
         * // → Se quita clase 'damaged' → Cuadrado vuelve a verde
         */
        function toggleHPSegment(event) {
            const segment = event.target;
            segment.classList.toggle('damaged');
                // Log opcional para debugging
            const isDamaged = segment.classList.contains('damaged');
            console.log(`💔 Cuadrado HP ${isDamaged ? 'dañado' : 'curado'}`);
        }
        /**
         * Actualiza los valores de MOV e INIT basándose en el atributo DES
         * 
         * En el sistema de reglas de MechWarrior:
         * - MOV (Movimiento) = DES por defecto
         * - INIT (Iniciativa) = DES por defecto
         * 
         * Esta función se puede llamar cuando DES cambia para actualizar automáticamente
         * estos valores derivados.
         * 
         * @returns {void}
         * 
         * @example
         * // Usuario cambia DES de 4 a 6
         * actualizarMovInitBarracones();
         * // MOV y INIT se actualizan automáticamente a 6
         */
        function actualizarMovInitBarracones() {
            const des = parseInt(document.getElementById('barr-des').value) || 0;
            const barrMov = document.getElementById('barr-mov');
            const barrInit = document.getElementById('barr-init');
                if (barrMov) barrMov.value = des;
            if (barrInit) barrInit.value = des;
                console.log(`🏃 MOV e INIT actualizados a ${des} (basado en DES)`);
        }


        function rellenarCamposFichaDesdeGenerador() {
            // Calcular año final
            let decade = parseInt(document.getElementById('select-decade').value) || 2990;
            let yearDigit = parseInt(document.getElementById('select-year-digit').value) || 0;
            let ageRoll = parseInt(document.getElementById('select-edad-roll').value) || 0;
            let finalYear = decade + yearDigit + ageRoll;

            // Rellenar campos básicos de la ficha
            document.getElementById('nombre-field').value = document.getElementById('select-nombre').value;
            document.getElementById('jugador-field').value = document.getElementById('select-jugador').value;
            document.getElementById('origen-output').value = document.getElementById('origen-select').value;
            document.getElementById('estudios-output').value = document.getElementById('estudios-select').value;
            document.getElementById('faction-output').value = document.getElementById('faction-select').value;
                // Mech
            let mechModel = document.getElementById('hidden-mech-model').value;
            let mechTons = document.getElementById('hidden-mech-tons').value;
            if (currentCampaign === 'IS') { 
                document.getElementById('mech-output').value = mechTons ? mechTons + " Tons" : ""; 
            } else { 
                document.getElementById('mech-output').value = mechModel && mechTons ? mechModel + " (" + mechTons + " Tons)" : ""; 
            }

            document.getElementById('edad-field').value = finalYear;
            document.getElementById('sexo-field').value = document.getElementById('select-sexo').value;
            document.getElementById('altura-field').value = document.getElementById('select-altura').value;
            document.getElementById('peso-field').value = document.getElementById('select-peso').value;
            document.getElementById('pelo-field').value = document.getElementById('select-pelo').value;
            document.getElementById('ojos-field').value = document.getElementById('select-ojos').value;
                // Atributos
            document.getElementById('attr-str').innerText = document.getElementById('select-str').value;
            document.getElementById('attr-dex').innerText = document.getElementById('select-dex').value;
            document.getElementById('attr-int').innerText = document.getElementById('select-int').value;
            document.getElementById('attr-cha').innerText = document.getElementById('select-cha').value;
                // Finanzas y XP
            document.getElementById('sheet-cbills').value = document.getElementById('gen-cbills').value;
            document.getElementById('sheet-salary').value = document.getElementById('gen-salary').value;
            document.getElementById('sheet-xp-total').value = document.getElementById('gen-xp-total').value;
            document.getElementById('sheet-xp-avail').value = document.getElementById('gen-xp-avail').value;

            // Generar habilidades
            let strInt = parseInt(document.getElementById('select-str').value) || 0;
            let dexInt = parseInt(document.getElementById('select-dex').value) || 0;
            let intInt = parseInt(document.getElementById('select-int').value) || 0;
            let chaInt = parseInt(document.getElementById('select-cha').value) || 0;
                if(strInt > 0 && dexInt > 0 && intInt > 0 && chaInt > 0) {
                let estudios = document.getElementById('estudios-select').value;
                let nobleSkill = document.getElementById('noble-skill-select').value;
                        let skills = getSkillsFromStudy(estudios, nobleSkill);
                for (let i = 1; i <= 3; i++) {
                    let row = document.getElementById('skill-row-' + i);
                    if (row && row.style.display !== 'none') {
                        let extraSkillName = document.getElementById('extra-skill-select-' + i).value;
                        let extraSkillLevel = document.getElementById('extra-skill-level-' + i).value;
                        if (extraSkillName && extraSkillLevel) skills.push({ n: extraSkillName, v: extraSkillLevel, c: "UNI" }); 
                    }
                }
                        let skillContainer = document.getElementById('skill-list-container');
                let html = '<table class="skill-table"><thead><tr><th>↑</th><th>Habilidad</th><th>Nivel</th><th>Caract.</th><th>Tirada</th></tr></thead><tbody>';
                let universalCaract = Math.round((strInt + dexInt + intInt + chaInt) / 4);
                        const squaresHTML = '<div class="q-box-container"><div class="chk-box"></div><div class="chk-box"></div><div class="chk-box"></div><div class="chk-box"></div></div>';
                        skills.forEach(s => {
                    let rollCalc = universalCaract - parseInt(s.v);
                    let skillNameDisplay = s.n === "Lenguaje" ? "Lenguaje (Elegido)" : s.n; 
                    html += `<tr><td class="skill-xp-col">${squaresHTML}</td><td>${skillNameDisplay}</td><td class="skill-level-col" data-base="${s.v}">${s.v}</td><td class="skill-attr-col">${universalCaract}</td><td class="skill-roll-col" style="text-align: center; font-weight: bold;">${rollCalc}</td></tr>`;
                });
                        let filasParaRellenar = intInt - skills.length;
                for(let i=0; i < filasParaRellenar; i++) {
                    html += `<tr><td class="skill-xp-col">${squaresHTML}</td><td><input type="text" class="sheet-input" placeholder="Nueva habilidad"></td><td class="skill-level-col"><input type="text" class="sheet-input" style="text-align:center" value="0" onchange="recalcularFilaManual(this)"></td><td class="skill-attr-col">${universalCaract}</td><td class="skill-roll-col">${universalCaract}</td></tr>`;
                }
                html += '</tbody></table>';
                skillContainer.innerHTML = html;
            }

            // MERITS Y DEMERITS
            const meritContainer = document.getElementById('merit-container');
            const demeritContainer = document.getElementById('demerit-container');
                meritContainer.innerHTML = '';
            demeritContainer.innerHTML = '';
                for(let i=1; i<=MAX_TRAITS; i++) {
                let mVal = document.getElementById('merit-select-'+i).value;
                if(mVal) {
                    meritContainer.innerHTML += `<div class="field">${mVal}</div>`;
                }
                        let dVal = document.getElementById('demerit-select-'+i).value;
                if(dVal) {
                    demeritContainer.innerHTML += `<div class="field">${dVal}</div>`;
                }
            }
                // Añadir méritos/deméritos especiales
            let specialMerit = document.getElementById('special-merit-field').innerText;
            let specialDemerit = document.getElementById('special-demerit-field').innerText;
                if(specialMerit) {
                meritContainer.innerHTML += `<div class="special-trait">${specialMerit}</div>`;
            }
            if(specialDemerit) {
                demeritContainer.innerHTML += `<div class="special-trait">${specialDemerit}</div>`;
            }

            // Renderizar puntos de vida
            if (typeof renderizarPuntosDeVida === 'function') {
                renderizarPuntosDeVida(strInt);
            }

            // Título
            const sheetTitle = document.getElementById('sheet-title-text');
            if (sheetTitle) {
                if (currentCampaign === 'ELH') sheetTitle.innerText = "REGISTRO DE LA CABALLERÍA LIGERA DE ERIDANI";
                else sheetTitle.innerText = "HOJA DE SERVICIO MECHWARRIOR";
            }
        }

        // 1. Guardar/Cargar LOCAL (JSON)
        function exportarDatos() {
            const datos = recogerDatosDeUI();
            const jsonString = JSON.stringify(datos, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
                const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", url);
            downloadAnchorNode.setAttribute("download", (datos.nombre || "personaje") + "_mw_data.json");
            document.body.appendChild(downloadAnchorNode); 
            downloadAnchorNode.click(); 
            downloadAnchorNode.remove();
            URL.revokeObjectURL(url);
        }

        function importarDatos(input) {
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const datos = JSON.parse(e.target.result);
                    rellenarUIConDatos(datos);
                    alert("Datos cargados correctamente del archivo JSON. Ahora puedes 'Guardar en la Nube' para migrarlos.");
                } catch (err) { 
                    console.error("Error al importar:", err); 
                    alert("Error al leer el archivo. Asegúrate de que sea un archivo JSON válido.");
                }
            };
            reader.readAsText(file, 'UTF-8');
            input.value = '';
        }

        // 2. Guardar/Cargar NUBE (Google Apps Script)
        let personajesEncontradosCache = [];

        function buscarEnNube() {
            if (GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_SCRIPT")) {
                alert("¡Error! Debes configurar la variable GOOGLE_SCRIPT_URL en el código HTML primero.");
                return;
            }
                // Detectar si estamos en el editor o en el generador
            const fichaVisible = document.getElementById('ficha-container').style.display !== 'none';
            const searchInput = fichaVisible ? 'search-cloud-name-editor' : 'search-cloud-name';
            const resultsDiv = fichaVisible ? 'cloud-search-results-editor' : 'cloud-search-results';
            const btnSearch = fichaVisible ? 'btn-cloud-search-editor' : 'btn-cloud-search';
                const nombreJugador = document.getElementById(searchInput).value;
            if (!nombreJugador) { alert("Escribe el nombre del JUGADOR para buscar."); return; }

            const btn = document.getElementById(btnSearch);
            const resultsContainer = document.getElementById(resultsDiv);

            btn.disabled = true; btn.innerText = "Buscando...";
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';

            fetch(`${GOOGLE_SCRIPT_URL}?jugador=${encodeURIComponent(nombreJugador)}`)
            .then(response => response.json())
            .then(data => {
                btn.disabled = false; btn.innerText = "🔍 Buscar";
                if (data.result === "success") {
                    const personajes = data.personajes;

                    if (!personajes || personajes.length === 0) {
                        alert("No se encontraron personajes para ese jugador.");
                        return;
                    }

                    if (personajes.length === 1) {
                        rellenarUIConDatos(personajes[0]);
                        // Si cargamos desde la nube y estábamos en landing, ir al generador
                        if(!fichaVisible) goToGenerator();
                    } else {
                        // Múltiples resultados
                        personajesEncontradosCache = personajes;
                        resultsContainer.style.display = 'block';
                        let html = `<div style="font-weight:bold; margin-bottom:5px;">Se encontraron ${personajes.length} personajes:</div>`;

                        personajes.forEach((p, index) => {
                            html += `
                            <div class="cloud-result-item" onclick="cargarPersonajeDesdeCache(${index})">
                                <div>
                                    <strong>${p.nombre}</strong> <span style="font-size:11px; color:#666;">(${p.campaign})</span>
                                </div>
                                <button class="cloud-result-btn">Cargar</button>
                            </div>`;
                        });
                        resultsContainer.innerHTML = html;
                    }
                } else {
                    alert("Error: " + (data.msg || "Error desconocido al buscar."));
                }
            })
            .catch(error => {
                btn.disabled = false; btn.innerText = "🔍 Buscar";
                console.error("Error:", error);
                alert("Error de conexión con la nube: " + error);
            });
        }

        function cargarPersonajeDesdeCache(index) {
            if (personajesEncontradosCache[index]) {
                const p = personajesEncontradosCache[index];
                        // Verificar si estamos en Barracones o en Generador
                const barraconesVisible = document.getElementById('barracones').style.display !== 'none';
                        if (barraconesVisible) {
                    // Cargar en Barracones
                    cargarPersonajeEnBarracones(p);
                                // Cerrar resultados de Barracones
                    const resultsBarr = document.getElementById('cloud-search-results-barracones');
                    if(resultsBarr) resultsBarr.style.display = 'none';
                } else {
                    // Cargar en Generador
                    rellenarUIConDatos(p);
                                // Cerrar resultados tanto en generador como en editor
                    const resultsGen = document.getElementById('cloud-search-results');
                    const resultsEditor = document.getElementById('cloud-search-results-editor');
                    if(resultsGen) resultsGen.style.display = 'none';
                    if(resultsEditor) resultsEditor.style.display = 'none';
                                // Si no estamos en ficha, ir al generador
                    const fichaVisible = document.getElementById('ficha-container').style.display !== 'none';
                    if(!fichaVisible) goToGenerator();
                }
            }
        }

        function guardarEnNube() {
            if (GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_SCRIPT")) {
                alert("¡Error! Debes configurar la variable GOOGLE_SCRIPT_URL en el código HTML primero.");
                return;
            }
            const datos = recogerDatosDeUI();
            if (!datos.nombre) { alert("El personaje necesita un nombre para guardarse."); return; }

            const btn = document.getElementById('btn-cloud-save');
            const originalText = btn.innerText;
            btn.disabled = true; btn.innerText = "Guardando...";

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
                btn.disabled = false; btn.innerText = originalText;
                if (data.result === "success") {
                    alert("¡Guardado exitoso en Google Sheet!");
                } else {
                    alert("Error al guardar: " + data.msg);
                }
            })
            .catch(error => {
                btn.disabled = false; btn.innerText = originalText;
                console.error("Error:", error);
                alert("Error de conexión al intentar guardar.");
            });
        }

        /**
         * Carga rápida de personaje por nombre
         * @param {string} nombreJugador - Nombre del jugador a buscar
         */
        function cargarPersonajeRapido(nombreJugador) {
            // Poner el nombre en el input de búsqueda
            const searchInput = document.getElementById('search-cloud-name-barracones');
            if (searchInput) {
                searchInput.value = nombreJugador;
            }
            // Ejecutar la búsqueda
            buscarEnNubeBarracones();
        }

        /**
         * Busca personajes en la nube desde la barra de herramientas de Barracones
         * Funcionalidad idéntica a buscarEnNube() pero usa los elementos DOM de Barracones
         * 
         * @returns {void}
         * 
         * ELEMENTOS DOM ESPECÍFICOS DE BARRACONES:
         * - #search-cloud-name-barracones: Input de búsqueda
         * - #cloud-search-results-barracones: Contenedor de resultados
         * 
         * PROCESO:
         * 1. Validar configuración de Google Script
         * 2. Leer nombre del jugador del input
         * 3. Realizar fetch a Google Sheets
         * 4. Mostrar resultados:
         *    - 1 personaje: Cargar automáticamente
         *    - Múltiples: Mostrar lista para seleccionar
         * 5. Navegar al generador si carga exitosa
         * 
         * VALIDACIONES:
         * - Verifica GOOGLE_SCRIPT_URL configurado
         * - Verifica que se ingrese nombre de jugador
         * - Maneja errores de conexión
         * 
         * DEPENDENCIAS:
         * - GOOGLE_SCRIPT_URL (constante global)
         * - rellenarUIConDatos() para cargar datos
         * - cargarPersonajeDesdeCache() para selección múltiple
         * - goToGenerator() para navegación
         */
        function buscarEnNubeBarracones() {
            // VALIDACIÓN: Verificar que Google Script está configurado
            if (GOOGLE_SCRIPT_URL.includes("https://script.google.com/macros/s/AKfycbzEBozWGpueZ-JoYVrn7L7r7FWDOiSfn_rr91JeLe4CudnpFLQfD_0yTAt0AAMveZw/exec")) {
                alert("¡Error! Debes configurar la variable GOOGLE_SCRIPT_URL en el código HTML primero.");
                return;
            }
                // ELEMENTOS DOM: Usar IDs específicos de Barracones
            const searchInput = 'search-cloud-name-barracones';
            const resultsDiv = 'cloud-search-results-barracones';
                // VALIDACIÓN: Verificar que se ingresó nombre
            const nombreJugador = document.getElementById(searchInput).value;
            if (!nombreJugador) { 
                alert("Escribe el nombre del JUGADOR para buscar."); 
                return; 
            }

            // ELEMENTOS DOM: Referencias al botón (creado dinámicamente, usar querySelector)
            const btn = document.querySelector('#barracones-toolbar button[onclick*="buscarEnNubeBarracones"]');
            const resultsContainer = document.getElementById(resultsDiv);
                if (!btn || !resultsContainer) {
                console.error('buscarEnNubeBarracones: Elementos DOM no encontrados');
                return;
            }

            // UI: Indicar estado de carga
            const originalBtnText = btn.innerText;
            btn.disabled = true; 
            btn.innerText = "BUSCANDO...";
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';

            // FETCH: Consultar Google Sheets
            console.log('🔍 Buscando personaje:', nombreJugador);
            fetch(`${GOOGLE_SCRIPT_URL}?jugador=${encodeURIComponent(nombreJugador)}`)
            .then(response => {
                console.log('📥 Respuesta de búsqueda:', response);
                return response.json();
            })
            .then(data => {
                console.log('📥 Datos de búsqueda parseados:', data);
                        // UI: Restaurar botón
                btn.disabled = false; 
                btn.innerText = originalBtnText;
                        if (data.result === "success") {
                    const personajes = data.personajes;
                    console.log('✅ Personajes encontrados:', personajes);

                    // VALIDACIÓN: Verificar que hay resultados
                    if (!personajes || personajes.length === 0) {
                        alert("No se encontraron personajes para ese jugador.");
                        return;
                    }

                    // CASO 1: Un solo personaje encontrado
                    if (personajes.length === 1) {
                        console.log('📦 Cargando personaje único:', personajes[0]);
                        console.log('📦 Armas del personaje:', personajes[0].armas);
                        console.log('📦 extraSkills del personaje:', personajes[0].extraSkills);
                                        // Verificar si estamos en Barracones o en Generador
                        const barraconesVisible = document.getElementById('barracones').style.display !== 'none';
                                        if (barraconesVisible) {
                            // Cargar en Barracones
                            cargarPersonajeEnBarracones(personajes[0]);
                            
                        } else {
                            // Cargar en Generador
                            rellenarUIConDatos(personajes[0]);
                            // Navegar al generador si estamos en landing
                            const fichaVisible = document.getElementById('ficha-container').style.display !== 'none';
                            if(!fichaVisible) goToGenerator();
                        }
                    } 
                    // CASO 2: Múltiples personajes encontrados
                    else {
                        // Cachear resultados para cargar después
                        personajesEncontradosCache = personajes;
                        resultsContainer.style.display = 'block';
                                        // Construir HTML de resultados con estilo Barracones
                        let html = `
                            <div style="
                                background: rgba(92, 66, 0, 0.3); 
                                border: 1px solid #5c4200; 
                                padding: 15px; 
                                margin-top: 15px;
                                font-family: 'Share Tech Mono', monospace;
                            ">
                                <div style="
                                    font-weight: bold; 
                                    margin-bottom: 10px; 
                                    color: #ffae00;
                                    text-align: center;
                                    letter-spacing: 2px;
                                ">
                                    [ ${personajes.length} PERSONAJES ENCONTRADOS ]
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                        `;

                        personajes.forEach((p, index) => {
                            html += `
                                <div 
                                    onclick="cargarPersonajeDesdeCache(${index})" 
                                    style="
                                        display: flex; 
                                        justify-content: space-between; 
                                        align-items: center; 
                                        background: rgba(0, 0, 0, 0.6); 
                                        border: 1px solid #5c4200; 
                                        padding: 10px; 
                                        cursor: pointer;
                                        transition: all 0.3s;
                                        clip-path: polygon(0 0, 98% 0, 100% 100%, 0 100%);
                                    "
                                    onmouseover="this.style.background='rgba(255, 174, 0, 0.2)'; this.style.borderColor='#ffae00'"
                                    onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='#5c4200'"
                                >
                                    <div>
                                        <strong style="color: #ffae00;">${p.nombre}</strong> 
                                        <span style="font-size: 11px; color: #00ff41;">(${p.campaign})</span>
                                    </div>
                                    <button style="
                                        padding: 5px 12px; 
                                        background: linear-gradient(135deg, #0288d1 0%, #01579b 100%); 
                                        border: 1px solid #00ff41; 
                                        color: #ffffff; 
                                        font-weight: bold; 
                                        font-size: 11px; 
                                        cursor: pointer;
                                        font-family: 'Share Tech Mono', monospace;
                                    ">
                                        CARGAR
                                    </button>
                                </div>
                            `;
                        });
                                        html += `
                                </div>
                            </div>
                        `;
                                        resultsContainer.innerHTML = html;
                    }
                } else {
                    alert("Error: " + (data.msg || "Error desconocido al buscar."));
                }
            })
            .catch(error => {
                // ERROR HANDLING: Restaurar UI y mostrar error
                btn.disabled = false; 
                btn.innerText = originalBtnText;
                console.error("Error en buscarEnNubeBarracones:", error);
                alert("Error de conexión con la nube: " + error);
            });
                                                          }

        /**
         * Recopila todos los datos del formulario de Barracones
         * @returns {Object} Objeto con todos los datos del personaje
         */
        /**
         * Recopila todos los datos del personaje desde la interfaz de Barracones
         * 
         * Esta función extrae y estructura todos los datos del personaje que están
         * actualmente en los campos de la interfaz de Barracones, incluyendo:
         * - Datos personales (nombre, jugador, rango)
         * - Atributos básicos (FUE, DES, INT, CAR)
         * - Estado físico (cuadrados HP dañados)
         * - Habilidades y sus niveles
         * - Mejoras de atributos y habilidades
         * - Armas equipadas y munición
         * 
         * @returns {Object} Objeto con todos los datos del personaje estructurados
         * @property {string} nombre - Nombre del personaje
         * @property {string} jugador - Nombre del jugador (callsign)
         * @property {string} rango - Rango militar del personaje
         * @property {string} tactico - ID táctico
         * @property {string} str - Valor de Fuerza (FUE)
         * @property {string} dex - Valor de Destreza (DES)
         * @property {string} int - Valor de Inteligencia (INT)
         * @property {string} cha - Valor de Carisma (CAR)
         * @property {string} mov - Valor de Movimiento
         * @property {string} init - Valor de Iniciativa
         * @property {Array<{select: string, munActual: string}>} armas - Array de 3 armas con índice y munición
         * @property {string} notas - Notas adicionales del personaje
         * @property {Array<{name: string, level: string, upgrades: number}>} extraSkills - Habilidades del personaje
         * @property {Object<string, number>} mejorasAtributos - Cantidad de mejoras por atributo {fue, des, int, car}
         * @property {Object<string, number>} mejorasHabilidades - Cantidad de mejoras por habilidad
         * @property {Array<{index: number, damaged: boolean}>} estadoFisico - Estado de cada cuadrado HP
         * 
         * @example
         * const datos = recogerDatosBarracones();
         * console.log(datos.nombre); // "John Connor"
         * console.log(datos.armas[0].select); // "5" (índice del arma)
         * console.log(datos.estadoFisico.filter(e => e.damaged).length); // 3 (cuadrados dañados)
         */
        function recogerDatosBarracones() {
            console.log('📦 Recopilando datos de Barracones...');
                try {
                // === PRESERVAR DATOS ORIGINALES DEL GENERADOR ===
                const datosOriginales = datosPersonajeBarracones || {};
                
                // === DATOS PERSONALES ===
                const datos = {
                    // ========== DATOS DEL GENERADOR (PRESERVADOS) ==========
                    campaign: datosOriginales.campaign || '',
                    decade: datosOriginales.decade || '',
                    year: datosOriginales.year || '',
                    mechMod: datosOriginales.mechMod || '',
                    mechRoll: datosOriginales.mechRoll || 0,
                    origen: datosOriginales.origen || '',
                    afiliacion: datosOriginales.afiliacion || '',
                    estudios: datosOriginales.estudios || '',
                    nobleSkill: datosOriginales.nobleSkill || '',
                    ageRoll: datosOriginales.ageRoll || '',
                    altura: datosOriginales.altura || '',
                    peso: datosOriginales.peso || '',
                    pelo: datosOriginales.pelo || '',
                    sexo: datosOriginales.sexo || '',
                    ojos: datosOriginales.ojos || '',
                    cbills: datosOriginales.cbills || '',
                    salary: datosOriginales.salary || '',
                    xpBase: datosOriginales.xpBase || '',
                    merits: datosOriginales.merits || [],
                    demerits: datosOriginales.demerits || [],
                    historia: datosOriginales.historia || '',
                    mech: datosOriginales.mech || '',
                    
                    // ========== DATOS DE BARRACONES (ACTUALES) ==========
                    // Identificación del personaje
                    nombre: document.getElementById('barr-nombre')?.value || '',
                    jugador: document.getElementById('barr-callsign')?.value || '',
                    rango: document.getElementById('barr-rango')?.value || '',
                    tactico: document.getElementById('barr-id')?.value || '',
                    
                    // Atributos básicos
                    str: document.getElementById('barr-fue')?.value || '0',
                    dex: document.getElementById('barr-des')?.value || '0',
                    int: document.getElementById('barr-int')?.value || '0',
                    cha: document.getElementById('barr-car')?.value || '0',
                    
                    // Stats de combate
                    mov: document.getElementById('barr-mov')?.value || '',
                    init: document.getElementById('barr-init')?.value || '',
                    
                    // XP (desde Barracones)
                    xpTotal: document.getElementById('barr-xp-total')?.value || '0',
                    xpDisponible: document.getElementById('barr-xp-disponible')?.value || '0',
                    xpAvail: document.getElementById('barr-xp-disponible')?.value || '0',
                    
                    // Armas equipadas
                    armas: [
                        {
                            select: document.getElementById('barr-arma1-select')?.value || '',
                            munActual: document.getElementById('barr-arma1-mun-actual')?.value || ''
                        },
                        {
                            select: document.getElementById('barr-arma2-select')?.value || '',
                            munActual: document.getElementById('barr-arma2-mun-actual')?.value || ''
                        },
                        {
                            select: document.getElementById('barr-arma3-select')?.value || '',
                            munActual: document.getElementById('barr-arma3-mun-actual')?.value || ''
                        }
                    ],
                    
                    // Otros datos
                    notas: document.getElementById('barr-notas')?.value || '',
                    
                    // Arrays para habilidades y mejoras
                    extraSkills: [],
                    mejorasAtributos: { fue: 0, des: 0, int: 0, car: 0 },
                    mejorasHabilidades: {}
                };
                        // === RECOPILAR MEJORAS DE ATRIBUTOS ===
                // Contar cuántos cuadrados de mejora están seleccionados para cada atributo
                const atributos = ['fue', 'des', 'int', 'car'];
                atributos.forEach(attr => {
                    try {
                        const attrId = 'barr-' + attr;
                        // Navegar desde el input del atributo hasta el contenedor de cuadrados
                        const inputElement = document.querySelector(`input#${attrId}`);
                        if (!inputElement) {
                            console.warn(`⚠️ No se encontró input para atributo: ${attr}`);
                            return;
                        }
                                        const container = inputElement.parentElement.parentElement;
                        const squares = container.querySelectorAll('.barracones-attr-upgrade');
                                        // Contar cuadrados con clase 'selected'
                        let selectedCount = 0;
                        squares.forEach(sq => {
                            if (sq.classList.contains('selected')) selectedCount++;
                        });
                                        datos.mejorasAtributos[attr] = selectedCount;
                                    } catch (error) {
                        console.warn(`⚠️ Error al recopilar mejoras de ${attr}:`, error);
                        datos.mejorasAtributos[attr] = 0;
                    }
                });
                        // === RECOPILAR HABILIDADES Y SUS MEJORAS ===
                // Iterar sobre todas las filas de la tabla de habilidades
                const skillsTable = document.getElementById('barr-skills-table');
                if (skillsTable) {
                    for (let i = 1; i < skillsTable.rows.length; i++) {
                        try {
                            const nombreCell = skillsTable.rows[i].cells[0];
                            const nivelInput = document.getElementById('barr-skill-' + (i-1) + '-nv');
                            const upgradesContainer = document.getElementById('barr-skill-' + (i-1) + '-upgrades');
                                                if (nombreCell && nivelInput) {
                                const skillName = nombreCell.textContent;
                                                        // Contar cuadrados de mejora seleccionados para esta habilidad
                                let selectedUpgrades = 0;
                                if (upgradesContainer) {
                                    const squares = upgradesContainer.querySelectorAll('.barracones-skill-upgrade');
                                    squares.forEach(sq => {
                                        if (sq.classList.contains('selected')) selectedUpgrades++;
                                    });
                                }
                                                        // Añadir habilidad al array con todos sus datos
                                datos.extraSkills.push({
                                    name: skillName,
                                    level: nivelInput.value,
                                    upgrades: selectedUpgrades
                                });
                                                        // Guardar mejoras indexadas por nombre de habilidad
                                datos.mejorasHabilidades[skillName] = selectedUpgrades;
                            }
                        } catch (error) {
                            console.warn(`⚠️ Error al procesar habilidad ${i}:`, error);
                        }
                    }
                } else {
                    console.warn('⚠️ No se encontró tabla de habilidades');
                }
                        // === RECOPILAR ESTADO FÍSICO (CUADRADOS HP) ===
                // Buscar TODOS los cuadrados HP (tanto horizontales como verticales)
                // Esto incluye cuadrados de CABEZA, TORSO, BRAZOS y PIERNAS
                const hpSegments = document.querySelectorAll('.barracones-hp-segment, .barracones-hp-segment-vertical');
                datos.estadoFisico = [];
                hpSegments.forEach((seg, idx) => {
                    datos.estadoFisico.push({
                        index: idx,                                // Posición del cuadrado
                        damaged: seg.classList.contains('damaged') // true si está dañado (rojo)
                    });
                });
                        // === LOGS DE DEBUGGING ===
                // Estos logs ayudan a diagnosticar problemas de guardado/carga
                console.log('🔍 ===== DEBUGGING recogerDatosBarracones() =====');
                console.log('🔫 Selector arma1:', document.getElementById('barr-arma1-select'));
                console.log('🔫 Valor arma1:', document.getElementById('barr-arma1-select')?.value);
                console.log('🔫 SelectedIndex arma1:', document.getElementById('barr-arma1-select')?.selectedIndex);
                console.log('🔫 Munición arma1:', document.getElementById('barr-arma1-mun-actual')?.value);
                console.log('🔫 Selector arma2:', document.getElementById('barr-arma2-select'));
                console.log('🔫 Valor arma2:', document.getElementById('barr-arma2-select')?.value);
                console.log('🔫 Munición arma2:', document.getElementById('barr-arma2-mun-actual')?.value);
                console.log('🔫 Selector arma3:', document.getElementById('barr-arma3-select'));
                console.log('🔫 Valor arma3:', document.getElementById('barr-arma3-select')?.value);
                console.log('🔫 Munición arma3:', document.getElementById('barr-arma3-mun-actual')?.value);
                console.log('📦 Array armas completo:', datos.armas);
                console.log('💔 Total cuadrados HP:', hpSegments.length);
                console.log('💔 Estado físico recopilado:', datos.estadoFisico);
                console.log('💔 Cuadrados dañados:', datos.estadoFisico.filter(e => e.damaged).length);
                console.log('🔍 ===== FIN DEBUGGING =====');
                
                // === RECOPILAR HISTORIAL DE COMPRAS ===
                // Guardamos el historial para persistencia entre sesiones
                // Combinamos el historial existente con las nuevas compras
                const historialExistente = datosOriginales.historialCompras || [];
                const historialNuevo = (typeof historialCompras !== 'undefined') ? historialCompras.map(c => ({
                    jugador: c.jugador,
                    tipo: c.tipo,
                    nombre: c.nombre,
                    nivelAnterior: c.nivelAnterior,
                    nivelNuevo: c.nivelNuevo,
                    costo: c.costo,
                    fecha: new Date().toLocaleDateString(),
                    hora: c.timestamp || new Date().toLocaleTimeString()
                })) : [];
                
                datos.historialCompras = [...historialExistente, ...historialNuevo];
                console.log('📜 Historial de compras a guardar:', datos.historialCompras);

                // === GUARDAR QUIRKS COMPRADOS ===
                const jugadorActual = datos.jugador || document.getElementById('barr-callsign')?.value || '';
                const quirksExistentes = datosOriginales.quirksComprados || [];
                const quirksNuevos = quirksComprados[jugadorActual] || [];
                datos.quirksComprados = [...quirksExistentes, ...quirksNuevos];
                
                        console.log('✅ Datos recopilados exitosamente');
                return datos;
                    } catch (error) {
                console.error('❌ Error crítico al recopilar datos de Barracones:', error);
                // Devolver objeto mínimo en caso de error catastrófico
                return {
                    nombre: '',
                    jugador: '',
                    error: error.message
                                                };
            }
        }
        /**
         * Guarda los datos de Barracones en la nube (Google Sheets)
         */
        /**
         * Guarda los datos del personaje desde Barracones en Google Sheets
         * 
         * Esta función maneja el flujo completo de guardado:
         * 1. Valida la configuración de la URL del script
         * 2. Recopila todos los datos del personaje via recogerDatosBarracones()
         * 3. Valida que hay datos mínimos (al menos nombre)
         * 4. Actualiza UI del botón (disabled + texto "GUARDANDO...")
         * 5. Envía datos via POST a Google Apps Script
         * 6. Maneja respuesta exitosa o errores
         * 7. Restaura el botón al estado original
         * 
         * @async
         * @returns {Promise<boolean>} true si guardó exitosamente, false en caso de error
         * 
         * @throws {Error} Si la URL de Google Script no está configurada
         * @throws {Error} Si falla la conexión HTTP
         * @throws {Error} Si el servidor devuelve un error
         * 
         * @example
         * // Uso básico
         * const guardado = await guardarEnNubeBarracones();
         * if (guardado) {
         *     console.log("Personaje guardado");
         * }
         * 
         * @see recogerDatosBarracones() - Para ver qué datos se guardan
         * @see GOOGLE_SCRIPT_URL - Constante global con la URL del backend
         */
        function guardarEnNubeBarracones() {
            console.log('💾 ====== INICIANDO GUARDADO ======');
            
            // === CONFIRMAR SI SE GASTÓ XP ===
            if (xpGastadoEstaSesion) {
                if (!confirm('⚠️ Has gastado XP en mejoras esta sesión.\n\n¿Estás seguro de que quieres guardar los cambios?\n\nEsta acción no se puede deshacer.')) {
                    console.log('❌ Guardado cancelado por el usuario');
                    return Promise.resolve(false);
                }
            }
            
                // === VALIDAR CONFIGURACIÓN ===
            // Verificar que la URL del Google Apps Script esté configurada correctamente
            if (GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_SCRIPT")) {
                console.error('❌ URL de Google Script no configurada');
                alert("¡Error! Debes configurar la variable GOOGLE_SCRIPT_URL en el código HTML primero.");
                return Promise.resolve(false);
            }
                // === RECOPILAR DATOS ===
            // Obtener todos los datos del personaje desde los campos de la UI
            const datos = recogerDatosBarracones();
                // Logs detallados para debugging
            console.log('💾 ====== GUARDANDO EN LA NUBE ======');
            console.log('📦 Datos recopilados:', JSON.stringify(datos, null, 2));
            console.log('📊 Nombre:', datos.nombre);
            console.log('📊 Jugador:', datos.jugador);
            console.log('📊 Armas:', datos.armas);
            console.log('📊 extraSkills:', datos.extraSkills);
            console.log('📊 mejorasAtributos:', datos.mejorasAtributos);
            console.log('📊 mejorasHabilidades:', datos.mejorasHabilidades);
            console.log('📊 estadoFisico:', datos.estadoFisico);
                // === VALIDAR DATOS MÍNIMOS ===
            // Un personaje DEBE tener al menos un nombre para ser guardado
            if (!datos.nombre || datos.nombre.trim() === '') {
                console.error('❌ ERROR: nombre vacío o solo espacios');
                console.log('📊 Valor del campo barr-nombre:', document.getElementById('barr-nombre'));
                console.log('📊 Valor actual:', document.getElementById('barr-nombre')?.value);
                alert("El personaje necesita un nombre para guardarse.");
                return Promise.resolve(false);
            }
                // === ACTUALIZAR UI DEL BOTÓN ===
            // Indicar visualmente que se está guardando (deshabilitar botón y cambiar texto)
            const originalText = "GUARDAR EN LA NUBE";
            const btn = document.querySelector('#barracones-toolbar button[onclick*="guardarEnNubeBarracones"]');
            if (btn) {
                btn.disabled = true;
                btn.innerText = "GUARDANDO...";
                btn.style.opacity = "0.6";
                btn.style.cursor = "wait";
            }
                // === ENVIAR A GOOGLE SHEETS ===
            console.log('📤 Enviando datos a Google Sheets...');
            console.log('📤 URL:', GOOGLE_SCRIPT_URL);
            console.log('📤 Body:', JSON.stringify(datos));
            console.log('📤 Tamaño del payload:', JSON.stringify(datos).length, 'caracteres');
                // Realizar petición HTTP POST
            return fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',  // Permitir CORS (necesario para Google Apps Script)
                body: JSON.stringify(datos)
            })
            .then(response => {
                console.log('📥 Respuesta HTTP recibida:');
                console.log('  - Status:', response.status);
                console.log('  - OK:', response.ok);
                console.log('  - Headers:', response.headers);
                        // Verificar que la respuesta HTTP sea exitosa (200-299)
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                }
                        return response.json();
            })
            .then(data => {
                console.log('📥 Datos parseados del servidor:', data);
                        // Restaurar el botón al estado original
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = originalText;
                    btn.style.opacity = "1";
                    btn.style.cursor = "pointer";
                }
                        // === MANEJAR RESPUESTA DEL SERVIDOR ===
                if (data.result === "success") {
                    console.log('✅ Guardado exitoso!');
                    console.log('📝 Mensaje del servidor:', data.msg);
                    // Resetear tracking de XP y bloquear cuadrados seleccionados
                    xpGastadoEstaSesion = false;
                    // Marcar todos los cuadrados seleccionados como bloqueados
                    document.querySelectorAll('.barracones-attr-upgrade.selected:not(.locked)').forEach(sq => {
                        sq.classList.add('locked');
                    });
                    document.querySelectorAll('.barracones-skill-upgrade.selected:not(.locked)').forEach(sq => {
                        sq.classList.add('locked');
                    });
                    
                    // REGISTRAR TODAS LAS MEJORAS EN "RESPUESTAS DE FORMULARIO 1"
                    // Solo se registran al guardar, no al hacer click
                    if (typeof historialCompras !== 'undefined' && historialCompras.length > 0) {
                        console.log('📝 Registrando', historialCompras.length, 'mejoras en el formulario...');
                        historialCompras.forEach(compra => {
                            registrarMejoraEnFormulario(
                                compra.jugador, 
                                compra.costo, 
                                compra.tipo, 
                                compra.nombre, 
                                compra.nivelAnterior, 
                                compra.nivelNuevo
                            );
                        });
                    }
                    
                    // Mover historial de sesión a persistente y limpiar sesión
                    if (typeof historialCompras !== 'undefined' && typeof historialComprasPersistente !== 'undefined') {
                        // Las compras de esta sesión ahora son parte del historial persistente
                        historialComprasPersistente = [...historialComprasPersistente, ...historialCompras.map(c => ({
                            jugador: c.jugador,
                            tipo: c.tipo,
                            nombre: c.nombre,
                            nivelAnterior: c.nivelAnterior,
                            nivelNuevo: c.nivelNuevo,
                            costo: c.costo,
                            fecha: c.fecha || new Date().toLocaleDateString(),
                            hora: c.timestamp
                        }))];
                        historialCompras = [];
                        actualizarVistaHistorial();
                    }
                    // Actualizar valores originales para futuras sesiones
                    if (typeof guardarValoresOriginales === 'function') {
                        guardarValoresOriginales();
                    }
                    alert("¡Guardado exitoso en Google Sheet!\n\n" + (data.msg || ''));
                    return true;
                } else {
                    // El servidor respondió pero hubo un error de lógica
                    console.error('❌ Error del servidor:', data.msg);
                    alert("Error al guardar: " + (data.msg || 'Error desconocido'));
                    return false;
                }
            })
            .catch(error => {
                console.error('❌ Error de conexión o procesamiento:', error);
                console.error('  - Tipo:', error.name);
                console.error('  - Mensaje:', error.message);
                console.error('  - Stack:', error.stack);
                        // Restaurar el botón en caso de error
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = originalText;
                    btn.style.opacity = "1";
                    btn.style.cursor = "pointer";
                }
                        // Mostrar mensaje de error al usuario
                alert("Error de conexión al intentar guardar.\n\n" + 
                      "Detalles técnicos: " + error.message + "\n\n" +
                      "Verifica tu conexión a Internet y que el script de Google esté publicado correctamente.");
                        return false;
            });
        }
        /**
         * Restaura el estado de los cuadrados de mejora de atributos
         * @param {Object} mejorasAtributos - Objeto con cantidad de mejoras por atributo
         *                                    {fue: 2, des: 1, int: 0, car: 2}
         */
        function restaurarMejorasAtributos(mejorasAtributos) {
            if (!mejorasAtributos) return;
                const atributos = ['fue', 'des', 'int', 'car'];
                atributos.forEach(attr => {
                const cantidadMejoras = mejorasAtributos[attr] || 0;
                if (cantidadMejoras === 0) return;
                        const attrId = 'barr-' + attr;
                const input = document.getElementById(attrId);
                if (!input) return;
                        // Encontrar el contenedor de cuadrados de mejora
                const container = input.parentElement.parentElement;
                const squares = container.querySelectorAll('.barracones-attr-upgrade');
                        // Seleccionar y BLOQUEAR la cantidad correcta de cuadrados
                for (let i = 0; i < Math.min(cantidadMejoras, squares.length); i++) {
                    squares[i].classList.add('selected');
                    squares[i].classList.add('locked'); // Bloquear para que no se pueda deseleccionar
                }
            });
        }
        /**
         * Restaura el estado de los cuadrados de mejora de habilidades
         * @param {Object} mejorasHabilidades - Objeto con cantidad de mejoras por habilidad
         *                                      {"Pilotar Mech": 2, "Disparo Mech": 3, ...}
         */
        function restaurarMejorasHabilidades(mejorasHabilidades) {
            if (!mejorasHabilidades) return;
                const skillsTable = document.getElementById('barr-skills-table');
            if (!skillsTable) return;
                // Iterar sobre todas las filas de habilidades
            for (let i = 1; i < skillsTable.rows.length; i++) {
                const nombreCell = skillsTable.rows[i].cells[0];
                const skillName = nombreCell.textContent;
                const cantidadMejoras = mejorasHabilidades[skillName] || 0;
                        if (cantidadMejoras === 0) continue;
                        const upgradesContainer = document.getElementById('barr-skill-' + (i-1) + '-upgrades');
                if (!upgradesContainer) continue;
                        const squares = upgradesContainer.querySelectorAll('.barracones-skill-upgrade');
                        // Seleccionar y BLOQUEAR la cantidad correcta de cuadrados
                for (let j = 0; j < Math.min(cantidadMejoras, squares.length); j++) {
                    squares[j].classList.add('selected');
                    squares[j].classList.add('locked'); // Bloquear para que no se pueda deseleccionar
                }
            }
        }
        /**
         * Restaura los niveles correctos en los inputs de habilidades
         * @param {Array} extraSkills - Array con {name, level, upgrades}
         */
        function restaurarNivelesHabilidades(extraSkills) {
            if (!extraSkills || !Array.isArray(extraSkills)) {
                console.log('⚠️ restaurarNivelesHabilidades: extraSkills no válido');
                return;
            }
                const skillsTable = document.getElementById('barr-skills-table');
            if (!skillsTable) {
                console.log('⚠️ restaurarNivelesHabilidades: tabla no encontrada');
                return;
            }
                console.log('✅ Restaurando niveles de habilidades:', extraSkills);
                // Crear mapa de niveles por nombre
            const nivelesMap = {};
            extraSkills.forEach(skill => {
                if (skill.name && skill.level) {
                    nivelesMap[skill.name] = parseInt(skill.level) || 0;
                }
            });
                console.log('📊 Mapa de niveles:', nivelesMap);
                // Iterar sobre todas las filas y actualizar niveles
            for (let i = 1; i < skillsTable.rows.length; i++) {
                const nombreCell = skillsTable.rows[i].cells[0];
                const skillName = nombreCell.textContent;
                const nivelInput = document.getElementById('barr-skill-' + (i-1) + '-nv');
                        if (nivelInput && nivelesMap[skillName] !== undefined) {
                    const nivelAnterior = nivelInput.value;
                    nivelInput.value = nivelesMap[skillName];
                    console.log(`  📝 ${skillName}: ${nivelAnterior} → ${nivelesMap[skillName]}`);
                }
            }
        }
        /**
         * Restaura el estado físico (daños) en los cuadrados de HP
         * @param {Array} estadoFisico - Array de {index, damaged}
         */
        function restaurarEstadoFisico(estadoFisico) {
            if (!estadoFisico || !Array.isArray(estadoFisico)) {
                console.log('⚠️ restaurarEstadoFisico: estadoFisico no válido');
                return;
            }
                console.log('💔 Restaurando estado físico:', estadoFisico);
                const hpSegments = document.querySelectorAll('.barracones-hp-segment, .barracones-hp-segment-vertical');
            console.log('💔 Cuadrados HP disponibles:', hpSegments.length);
                let dañadosRestaurados = 0;
            estadoFisico.forEach(estado => {
                if (estado.damaged && estado.index < hpSegments.length) {
                    hpSegments[estado.index].classList.add('damaged');
                    dañadosRestaurados++;
                    console.log(`  💔 Cuadrado ${estado.index} marcado como dañado`);
                }
            });
                console.log(`✅ Estado físico restaurado: ${dañadosRestaurados} cuadrados dañados`);
        }
        /**
         * Restaura las armas equipadas en Barracones desde datos guardados
         * 
         * Esta función restaura hasta 3 armas en los selectores de Barracones.
         * Incluye un sistema de timeouts en cascada para:
         * 1. Esperar a que los selectores estén poblados (150ms)
         * 2. Setear el valor del selector
         * 3. Cargar los stats del arma (daño, alcance)
         * 4. Esperar a que se complete la carga de stats (50ms)
         * 5. Restaurar la munición actual
         * 
         * NOTA IMPORTANTE: Los timeouts son necesarios porque:
         * - Los selectores se pueblan de forma asíncrona
         * - cargarArmaBarracones() necesita tiempo para actualizar los campos de stats
         * - La munición debe restaurarse DESPUÉS de que cargarArmaBarracones() 
         *   haya seteado la munición máxima
         * 
         * @param {Array<{select: string, munActual: string}>} armas - Array de hasta 3 armas
         * @param {string} armas[].select - Índice del arma en el selector (0-42)
         * @param {string} armas[].munActual - Munición actual del arma
         * 
         * @returns {void}
         * 
         * @example
         * // Restaurar 2 armas
         * const armas = [
         *     {select: "5", munActual: "35"},    // Laser Rifle con 35 balas
         *     {select: "12", munActual: "20"},   // Otra arma con 20 balas
         *     {select: "", munActual: ""}        // Slot vacío
         * ];
         * restaurarArmas(armas);
         * 
         * @see cargarArmaBarracones() - Función que carga los stats del arma
         * @see poblarSelectoresArmasBarracones() - Función que puebla los selectores
         */
        function restaurarArmas(armas) {
            // === VALIDACIÓN DE ENTRADA ===
            if (!armas || !Array.isArray(armas)) {
                console.warn('⚠️ restaurarArmas: parámetro armas inválido (debe ser array)');
                return;
            }
                console.log('🔫 Iniciando restauración de armas:', armas);
                // === TIMEOUT PRINCIPAL ===
            // Esperar 150ms para que los selectores estén completamente poblados
            // Este delay es necesario porque poblarSelectoresArmasBarracones() puede
            // tardar en completar el llenado de las opciones
            setTimeout(() => {
                console.log('  ⏱️ Selectores poblados, procediendo a restaurar...');
                        // === RESTAURAR ARMA 1 (PRINCIPAL) ===
                if (armas[0] && armas[0].select) {
                    const sel1 = document.getElementById('barr-arma1-select');
                                if (sel1) {
                        console.log(`  🔫 Restaurando Arma 1:`);
                        console.log(`     - Índice: ${armas[0].select}`);
                        console.log(`     - Munición: ${armas[0].munActual}`);
                                        // Setear el valor del selector (índice del arma)
                        sel1.value = armas[0].select;
                                        // Cargar los stats del arma (daño, alcance, munición máxima)
                        cargarArmaBarracones(1);
                                        // TIMEOUT ANIDADO: Esperar a que cargarArmaBarracones() complete
                        // Necesario porque cargarArmaBarracones() actualiza los campos de forma asíncrona
                        setTimeout(() => {
                            const mun1 = document.getElementById('barr-arma1-mun-actual');
                            if (mun1 && armas[0].munActual) {
                                mun1.value = armas[0].munActual;
                                console.log(`    ✅ Munición arma 1 restaurada: ${armas[0].munActual}`);
                            }
                        }, 50); // 50ms suficiente para que cargarArmaBarracones() actualice el DOM
                    } else {
                        console.warn('  ⚠️ Selector arma 1 no encontrado');
                    }
                }
                        // === RESTAURAR ARMA 2 (SECUNDARIA) ===
                if (armas[1] && armas[1].select) {
                    const sel2 = document.getElementById('barr-arma2-select');
                                if (sel2) {
                        console.log(`  🔫 Restaurando Arma 2:`);
                        console.log(`     - Índice: ${armas[1].select}`);
                        console.log(`     - Munición: ${armas[1].munActual}`);
                                        sel2.value = armas[1].select;
                        cargarArmaBarracones(2);
                                        setTimeout(() => {
                            const mun2 = document.getElementById('barr-arma2-mun-actual');
                            if (mun2 && armas[1].munActual) {
                                mun2.value = armas[1].munActual;
                                console.log(`    ✅ Munición arma 2 restaurada: ${armas[1].munActual}`);
                            }
                        }, 50);
                    } else {
                        console.warn('  ⚠️ Selector arma 2 no encontrado');
                    }
                }
                        // === RESTAURAR ARMA 3 (TERCIARIA) ===
                if (armas[2] && armas[2].select) {
                    const sel3 = document.getElementById('barr-arma3-select');
                                if (sel3) {
                        console.log(`  🔫 Restaurando Arma 3:`);
                        console.log(`     - Índice: ${armas[2].select}`);
                        console.log(`     - Munición: ${armas[2].munActual}`);
                                        sel3.value = armas[2].select;
                        cargarArmaBarracones(3);
                                        setTimeout(() => {
                            const mun3 = document.getElementById('barr-arma3-mun-actual');
                            if (mun3 && armas[2].munActual) {
                                mun3.value = armas[2].munActual;
                                console.log(`    ✅ Munición arma 3 restaurada: ${armas[2].munActual}`);
                            }
                        }, 50);
                    } else {
                        console.warn('  ⚠️ Selector arma 3 no encontrado');
                    }
                }
                        console.log('✅ Proceso de restauración de armas completado');
                    }, 150); // Timeout principal de 150ms
        }
        /**
         * Carga un personaje completo en la interfaz de Barracones desde datos guardados
         * 
         * Esta es la función principal de carga que orquesta la restauración de TODOS
         * los datos del personaje en la interfaz de Barracones. El proceso incluye:
         * 
         * FLUJO DE CARGA (12 pasos):
         * 1. Cargar datos básicos (nombre, jugador, rango, ID, notas)
         * 2. Cargar atributos básicos (FUE, DES, INT, CAR)
         * 3. Calcular y setear MOV e INIT (basados en DES)
         * 4. Generar cuadrados de estado físico (basados en FUE)
         * 5. Generar tabla de habilidades
         * 6. Calcular TIR inicial
         * 7. Restaurar mejoras de atributos (cuadrados dorados)
         * 8. [TIMEOUT TIMING.SKILLS_TABLE_RENDER] Restaurar niveles de habilidades
         * 9. [TIMEOUT TIMING.SKILLS_TABLE_RENDER] Restaurar mejoras de habilidades (cuadrados verdes)
         * 10. [TIMEOUT TIMING.SKILLS_TABLE_RENDER] Recalcular TIR con niveles correctos
         * 11. [TIMEOUT TIMING.HP_GENERATION] Restaurar estado físico (cuadrados HP dañados)
         * 12. [via restaurarArmas] Restaurar armas equipadas
         * 
         * NOTA SOBRE TIMEOUTS:
         * Los timeouts son necesarios porque varias operaciones requieren que el DOM
         * se actualice antes de continuar:
         * - generarHabilidadesBarracones() crea elementos dinámicamente
         * - generarEstadoFisicoBarracones() genera cuadrados HP
         * - Los selectores de armas necesitan poblarse antes de restaurar
         * 
         * @param {Object} datos - Objeto completo con todos los datos del personaje
         * @param {string} datos.nombre - Nombre del personaje
         * @param {string} datos.jugador - Nombre del jugador (se carga en callsign)
         * @param {string} datos.rango - Rango militar
         * @param {string} datos.tactico - ID táctico
         * @param {string} datos.str - Fuerza (FUE)
         * @param {string} datos.dex - Destreza (DES)
         * @param {string} datos.int - Inteligencia (INT)
         * @param {string} datos.cha - Carisma (CAR)
         * @param {string} datos.mov - Movimiento
         * @param {string} datos.init - Iniciativa
         * @param {string} datos.notas - Notas adicionales
         * @param {string} datos.estudios - Tipo de estudios (para generar habilidades)
         * @param {string} datos.nobleSkill - Habilidad noble (si aplica)
         * @param {Array} datos.extraSkills - Array de habilidades con niveles
         * @param {Object} datos.mejorasAtributos - Mejoras de atributos {fue, des, int, car}
         * @param {Object} datos.mejorasHabilidades - Mejoras de habilidades {nombreSkill: cantidad}
         * @param {Array} datos.estadoFisico - Estado de cada cuadrado HP
         * @param {Array} datos.armas - Array de armas equipadas
         * 
         * @returns {void}
         * 
         * @example
         * // Cargar un personaje desde Google Sheets
         * const datos = {
         *     nombre: "John Connor",
         *     jugador: "Marcos",
         *     str: "5", dex: "4", int: "3", cha: "3",
         *     armas: [{select: "5", munActual: "35"}, ...],
         *     estadoFisico: [{index: 2, damaged: true}, ...],
         *     // ... más datos
         * };
         * cargarPersonajeEnBarracones(datos);
         * 
         * @see recogerDatosBarracones() - Función inversa que recopila datos
         * @see generarEstadoFisicoBarracones() - Genera cuadrados HP
         * @see generarHabilidadesBarracones() - Genera tabla de habilidades
         * @see restaurarArmas() - Restaura armas equipadas
         * @see restaurarEstadoFisico() - Restaura daños en cuadrados HP
         */
        function cargarPersonajeEnBarracones(datos) {
            // === VALIDACIÓN DE ENTRADA ===
            if (!datos) {
                console.error('❌ cargarPersonajeEnBarracones: datos es null/undefined');
                return;
            }
            
            // === LIMPIAR EQUIPAMIENTO ANTERIOR ===
            console.log('🧹 Limpiando datos del personaje anterior...');
            
            // Limpiar atributos básicos
            const attrIds = ['barr-fue', 'barr-des', 'barr-int', 'barr-car'];
            attrIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = 0;
            });
            
            // Limpiar stats derivados
            const statIds = ['barr-mov', 'barr-init', 'barr-tir', 'barr-xp-disponible', 'barr-xp-total'];
            statIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = 0;
            });
            
            // Limpiar datos de identificación
            const idIds = ['barr-nombre', 'barr-callsign', 'barr-rango', 'barr-id'];
            idIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            
            // Limpiar armas (slots 1, 2, 3)
            for (let i = 1; i <= 3; i++) {
                const selectArma = document.getElementById(`barr-arma${i}-select`);
                const dmgInput = document.getElementById(`barr-arma${i}-dmg`);
                const alInput = document.getElementById(`barr-arma${i}-al`);
                const munActual = document.getElementById(`barr-arma${i}-mun-actual`);
                const munMax = document.getElementById(`barr-arma${i}-mun-max`);
                
                if (selectArma) {
                    selectArma.selectedIndex = 0; // Seleccionar "-- Arma --"
                    selectArma.value = '';
                }
                if (dmgInput) dmgInput.value = '';
                if (alInput) alInput.value = '';
                if (munActual) munActual.value = '';
                if (munMax) munMax.textContent = '0';
            }
            
            // Limpiar armadura
            const armorHead = document.getElementById('barr-armor-head');
            const armorTorso = document.getElementById('barr-armor-torso');
            const armorArms = document.getElementById('barr-armor-arms');
            const armorLegs = document.getElementById('barr-armor-legs');
            const armorType = document.getElementById('barr-armor-type');
            
            if (armorHead) armorHead.value = 0;
            if (armorTorso) armorTorso.value = 0;
            if (armorArms) armorArms.value = 0;
            if (armorLegs) armorLegs.value = 0;
            if (armorType) armorType.value = '';
            
            // Limpiar notas
            const notasEl = document.getElementById('barr-notas');
            if (notasEl) notasEl.value = '';

            // Limpiar panel 07 (rasgos, defectos, quirks) antes de rellenar con el nuevo personaje
            const meritosEl = document.getElementById('barr-meritos-lista');
            if (meritosEl) meritosEl.innerHTML = '<span style="color:#555; font-size:0.75em; font-style:italic;">Cargando...</span>';
            const defectosEl = document.getElementById('barr-defectos-lista');
            if (defectosEl) defectosEl.innerHTML = '<span style="color:#555; font-size:0.75em; font-style:italic;">Cargando...</span>';
            const quirksEl2 = document.getElementById('barr-quirks-lista');
            if (quirksEl2) quirksEl2.innerHTML = '<span style="color:#555; font-size:0.75em; font-style:italic;">Cargando...</span>';
            
            // Limpiar tabla de habilidades (niveles y cuadrados)
            const skillsTable = document.getElementById('barr-skills-table');
            if (skillsTable) {
                // Limpiar todas las filas excepto la cabecera
                for (let i = skillsTable.rows.length - 1; i > 0; i--) {
                    skillsTable.deleteRow(i);
                }
            }
            
            // Limpiar cuadrados de mejoras (quitar selected y locked)
            document.querySelectorAll('.barracones-attr-upgrade.selected, .barracones-attr-upgrade.locked').forEach(sq => {
                sq.classList.remove('selected', 'locked');
            });
            document.querySelectorAll('.barracones-skill-upgrade.selected, .barracones-skill-upgrade.locked').forEach(sq => {
                sq.classList.remove('selected', 'locked');
            });
            
            // Limpiar estado físico (HP)
            document.querySelectorAll('.barracones-hp-segment.damaged, .barracones-hp-segment-vertical.damaged').forEach(sq => {
                sq.classList.remove('damaged');
            });
            
            console.log('  ✅ Equipamiento limpiado');
            
            // Resetear tracking de XP gastado para nueva sesión
            xpGastadoEstaSesion = false;
            
            // Cargar historial de compras desde el personaje (persistencia entre sesiones)
            if (typeof historialCompras !== 'undefined') {
                // El historial guardado no tiene referencias a elementos DOM
                // Solo lo mostramos como referencia, sin posibilidad de deshacer
                historialComprasPersistente = datos.historialCompras || [];
                historialCompras = []; // Las nuevas compras de esta sesión van aquí
                console.log('📜 Historial cargado desde nube:', historialComprasPersistente.length, 'entradas');
            }
            
            // ✅ GUARDAR EN VARIABLE GLOBAL PARA PDF
            datosPersonajeBarracones = datos;
            console.log('💾 Datos guardados en variable global para PDF');
            
            console.log('🎯 ===== INICIANDO CARGA DE PERSONAJE =====');
            console.log('📦 Datos recibidos:', datos);
                try {
                // === PASO 1: CARGAR DATOS BÁSICOS ===
                console.log('📝 Paso 1: Cargando datos básicos...');
                        // Obtener referencias a los campos del formulario
                const barrNombre = document.getElementById('barr-nombre');
                const barrCallsign = document.getElementById('barr-callsign'); // Usado para campo "Jugador"
                const barrRango = document.getElementById('barr-rango');
                const barrId = document.getElementById('barr-id');
                const barrNotas = document.getElementById('barr-notas');
                        // Setear valores con validación
                if (barrNombre) barrNombre.value = datos.nombre || '';
                if (barrCallsign) barrCallsign.value = datos.jugador || ''; // Jugador → Callsign
                if (barrRango) barrRango.value = datos.rango || '';
                if (barrId) barrId.value = datos.tactico || '';
                if (barrNotas) barrNotas.value = datos.notas || '';
                        console.log('  ✅ Datos básicos cargados');
                        // === PASO 2: CARGAR ATRIBUTOS ===
                console.log('📊 Paso 2: Cargando atributos...');
                        const barrFue = document.getElementById('barr-fue');
                const barrDes = document.getElementById('barr-des');
                const barrInt = document.getElementById('barr-int');
                const barrCar = document.getElementById('barr-car');
                        // Parsear y validar atributos (deben ser números)
                const fue = parseInt(datos.str) || 0;
                const des = parseInt(datos.dex) || 0;
                const int = parseInt(datos.int) || 0;
                const car = parseInt(datos.cha) || 0;
                        if (barrFue) barrFue.value = fue;
                if (barrDes) barrDes.value = des;
                if (barrInt) barrInt.value = int;
                if (barrCar) barrCar.value = car;
                        console.log(`  ✅ Atributos cargados: FUE=${fue}, DES=${des}, INT=${int}, CAR=${car}`);
                        // === PASO 3: CALCULAR MOV E INIT ===
                console.log('🏃 Paso 3: Calculando MOV e INIT...');
                        const barrMov = document.getElementById('barr-mov');
                const barrInit = document.getElementById('barr-init');
                        // MOV e INIT se basan en DES por defecto, pero se pueden guardar valores custom
                if (barrMov) barrMov.value = datos.mov || des;
                if (barrInit) barrInit.value = datos.init || des;
                        console.log(`  ✅ MOV=${datos.mov || des}, INIT=${datos.init || des}`);
                        // === PASO 4: GENERAR ESTADO FÍSICO ===
                console.log('💔 Paso 4: Generando cuadrados de estado físico...');
                        if (fue > 0) {
                    generarEstadoFisicoBarracones(fue);
                    console.log(`  ✅ ${fue * 3 + fue + Math.floor(fue * 2) + Math.ceil(fue * 2)} cuadrados HP generados`);
                } else {
                    console.warn('  ⚠️ FUE = 0, no se generan cuadrados HP');
                }
                        // === PASO 5: GENERAR HABILIDADES ===
                console.log('📚 Paso 5: Generando tabla de habilidades...');
                generarHabilidadesBarracones(datos.estudios, datos.nobleSkill, datos.extraSkills);
                console.log('  ✅ Tabla de habilidades generada');
                        // === PASO 6: CALCULAR TIR INICIAL ===
                console.log('🎯 Paso 6: Calculando TIR inicial...');
                calcularTIRBarracones();
                console.log('  ✅ TIR calculado');
                        // === PASO 7: RESTAURAR MEJORAS DE ATRIBUTOS ===
                console.log('⬆️ Paso 7: Restaurando mejoras de atributos...');
                        if (datos.mejorasAtributos) {
                    restaurarMejorasAtributos(datos.mejorasAtributos);
                    console.log('  ✅ Mejoras de atributos restauradas:', datos.mejorasAtributos);
                } else {
                    console.log('  ℹ️ No hay mejoras de atributos para restaurar');
                }
                        // === PASOS 8-10: TIMEOUT PARA RENDERIZADO DE TABLA ===
                // IMPORTANTE: Necesitamos esperar 100ms para que la tabla de habilidades
                // se renderice completamente antes de modificar sus contenidos
                setTimeout(() => {
                    console.log('⏱️ Timeout 100ms completado, continuando con pasos 8-10...');
                                // === PASO 8: RESTAURAR NIVELES DE HABILIDADES ===
                    console.log('📊 Paso 8: Restaurando niveles de habilidades...');
                                if (datos.extraSkills) {
                        restaurarNivelesHabilidades(datos.extraSkills);
                        console.log('  ✅ Niveles de habilidades restaurados');
                    } else {
                        console.log('  ℹ️ No hay niveles de habilidades para restaurar');
                    }
                                // === PASO 9: RESTAURAR MEJORAS DE HABILIDADES ===
                    console.log('⬆️ Paso 9: Restaurando mejoras de habilidades...');
                                if (datos.mejorasHabilidades) {
                        restaurarMejorasHabilidades(datos.mejorasHabilidades);
                        console.log('  ✅ Mejoras de habilidades restauradas:', datos.mejorasHabilidades);
                    } else {
                        console.log('  ℹ️ No hay mejoras de habilidades para restaurar');
                    }
                                // === PASO 10: RECALCULAR TIR CON NIVELES CORRECTOS ===
                    console.log('🎯 Paso 10: Recalculando TIR con niveles correctos...');
                    calcularTIRBarracones();
                    console.log('  ✅ TIR recalculado');
                            }, TIMING.SKILLS_TABLE_RENDER); // Tiempo para renderizado completo de tabla
                        // === PASO 11: RESTAURAR ESTADO FÍSICO (DAÑOS) ===
                // TIMEOUT de TIMING.HP_GENERATION (150ms) para dar tiempo a que se generen los cuadrados HP
                if (datos.estadoFisico) {
                    console.log('💔 Paso 11: Programando restauración de estado físico...');
                                setTimeout(() => {
                        console.log('  ⏱️ Timeout completado, restaurando daños...');
                        restaurarEstadoFisico(datos.estadoFisico);
                    }, TIMING.HP_GENERATION); // Tiempo para que generarEstadoFisicoBarracones() complete
                } else {
                    console.log('💔 Paso 11: No hay estado físico para restaurar');
                }
                        // === PASO 12: RESTAURAR ARMAS ===
                console.log('🔫 Paso 12: Verificando y restaurando armas...');
                console.log('  🔍 datos.armas:', datos.armas);
                console.log('  🔍 Tipo:', typeof datos.armas);
                console.log('  🔍 Es array?', Array.isArray(datos.armas));
                        if (datos.armas) {
                    console.log('  ✅ datos.armas existe, llamando a restaurarArmas()');
                    restaurarArmas(datos.armas);
                } else {
                    console.warn('  ⚠️ datos.armas es undefined/null - No hay armas para restaurar');
                }
                        console.log('🎉 ===== CARGA DE PERSONAJE COMPLETADA =====');
                    } catch (error) {
                console.error('❌ ERROR CRÍTICO al cargar personaje:', error);
                console.error('  - Mensaje:', error.message);
                console.error('  - Stack:', error.stack);
                alert('Error al cargar el personaje. Revisa la consola para más detalles.');
            }

            // Cargar XP
            document.getElementById('barr-xp-disponible').value = datos.xpDisponible || 0;
            document.getElementById('barr-xp-total').value = datos.xpTotal || 0;
            
            // Inicializar sistema XP
            setTimeout(inicializarSistemaXP, 100);
            
            // Guardar valores originales para poder resetear mejoras de sesión
            setTimeout(guardarValoresOriginales, 200);

            // Renderizar panel de rasgos y quirks
            setTimeout(() => renderizarRasgosBarracones(datos), 250);
        }

        // --- FUNCIONES DE ARMAS ---
        function populateWeaponSelects() {
            const selects = document.querySelectorAll('.weapon-select');
            let options = '<option value="">-- Arma --</option>';
            const keys = Object.keys(WEAPON_LIST).sort();
            keys.forEach(key => { options += `<option value="${key}">${key}</option>`; });
            selects.forEach(sel => sel.innerHTML = options);
        }

        function updateWeaponRow(selectElement) {
            const weaponName = selectElement.value;
            const row = selectElement.closest('tr');
            const inputs = row.querySelectorAll('input'); 
                if (WEAPON_LIST[weaponName]) {
                const stats = WEAPON_LIST[weaponName];
                inputs[0].value = stats.dmg;
                inputs[1].value = stats.s;
                inputs[2].value = stats.m;
                inputs[3].value = stats.l;
                inputs[4].value = stats.car;
                inputs[5].value = stats.rec || ""; 
                inputs[6].value = stats.w;
            } else {
                inputs.forEach(input => input.value = "");
            }
        }

        /**
         * Pobla los desplegables de armas en Barracones con las armas de INFANTRY_WEAPON_TABLE
         * Se ejecuta al cargar la página
         */
        function poblarDesplegablesArmasBarracones() {
            const select1 = document.getElementById('barr-arma1-select');
            const select2 = document.getElementById('barr-arma2-select');
            const select3 = document.getElementById('barr-arma3-select');
                if (!select1 || !select2 || !select3) return;
                // Limpiar y añadir opción por defecto
            select1.innerHTML = '<option value="">-- Seleccionar Arma Principal --</option>';
            select2.innerHTML = '<option value="">-- Secundaria --</option>';
            select3.innerHTML = '<option value="">-- Terciaria --</option>';
                // Añadir todas las armas de la tabla
            INFANTRY_WEAPON_TABLE.forEach((arma, index) => {
                const option1 = document.createElement('option');
                option1.value = index;
                option1.textContent = arma.name;
                select1.appendChild(option1);
                        const option2 = document.createElement('option');
                option2.value = index;
                option2.textContent = arma.name;
                select2.appendChild(option2);
                        const option3 = document.createElement('option');
                option3.value = index;
                option3.textContent = arma.name;
                select3.appendChild(option3);
            });
        }
        /**
         * Carga los datos de un arma seleccionada en Barracones
         * @param {number} slotNum - Número de slot (1 o 2)
         */
        function cargarArmaBarracones(slotNum) {
            const select = document.getElementById(`barr-arma${slotNum}-select`);
            const dmgInput = document.getElementById(`barr-arma${slotNum}-dmg`);
            const alInput = document.getElementById(`barr-arma${slotNum}-al`);
            const munActualInput = document.getElementById(`barr-arma${slotNum}-mun-actual`);
            const munMaxSpan = document.getElementById(`barr-arma${slotNum}-mun-max`);
                if (!select || !dmgInput || !alInput || !munActualInput || !munMaxSpan) return;
                const index = parseInt(select.value);
                if (isNaN(index) || index < 0 || index >= INFANTRY_WEAPON_TABLE.length) {
                // Limpiar campos si no hay selección válida
                dmgInput.value = '';
                alInput.value = '';
                munActualInput.value = '';
                munMaxSpan.textContent = '0';
                munActualInput.max = '';
                return;
            }
                const arma = INFANTRY_WEAPON_TABLE[index];
                // Cargar datos del arma
            dmgInput.value = arma.dmg || '';
            alInput.value = `${arma.s}/${arma.m}/${arma.l}` || '';
                // Munición máxima (fija)
            const munMax = parseInt(arma.car) || 0;
            munMaxSpan.textContent = munMax;
            munActualInput.max = munMax;
                // SIEMPRE poner munición actual al máximo al cambiar de arma
            munActualInput.value = munMax;
        }
        /**
         * Valida que la munición actual no exceda la munición máxima
         * @param {number} slotNum - Número de slot (1, 2 o 3)
         */
        function validarMunicionBarracones(slotNum) {
            const munActualInput = document.getElementById(`barr-arma${slotNum}-mun-actual`);
            const munMaxSpan = document.getElementById(`barr-arma${slotNum}-mun-max`);
                if (!munActualInput || !munMaxSpan) return;
                const munActual = parseInt(munActualInput.value) || 0;
            const munMax = parseInt(munMaxSpan.textContent) || 0;
                // Si la munición actual es mayor que la máxima, ajustar al máximo
            if (munActual > munMax) {
                munActualInput.value = munMax;
            }
                // No permitir valores negativos
            if (munActual < 0) {
                munActualInput.value = 0;
            }
        }
        // Poblar desplegables cuando la página carga
        