export default (cleanUpChargeGeneralLabel: string) => [
    [
        { id: 'uniqueNo', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityRoomNo', type: 'string' },
        { id: 'fromDate', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityFromDate', type: 'date' },
        { id: 'untilDate', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityUntilDate', type: 'date' },
        { id: 'nightsStay', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityNightsStay', type: 'string'  },
        { id: 'noOfPersons', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityNumAdults', type: 'string'  },
        { id: 'noOfChildren', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityNumChildren', type: 'string'  },
        { id: 'noOfPetsSmall', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityNumPetsSmall', type: 'string'  },
        { id: 'noOfPetsLarge', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityNumPetsLarge', type: 'string'  },
        { id: 'childrenAges', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityChildrenAges', type: 'string'  }
    ],
    [
        { id: 'totalPriceAdults', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityAdultPrice', type: 'number' },
        { id: 'totalPriceChildren', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityChildrenPrice', type: 'number' },
        { id: 'totalServiceCharge', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityChildrenPrice', type: 'number' },
        { id: 'totalVisitorsTax', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityVisitorsTaxCharge', type: 'number' },
        { id: 'totalPetCharge', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityPetCharge', type: 'number' },
        { id: 'totalCleanUpCharge', label: cleanUpChargeGeneralLabel, type: 'number' },
        { id: 'totalDiscount', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityDiscount', type: 'number' },
        { id: 'totalShortStayCharge', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityShortStayCharge', type: 'number' },
        { id: 'totalNet', label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityTotalNet', type: 'number', style: ['bold']}
    ]
];
