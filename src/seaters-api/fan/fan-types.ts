export module fan {

    export interface NotificationChannels {
        byMail:boolean
        bySms:boolean
    }

    export interface DirectMarketingSettings {
        allowDirectMarketingFromSeaters:boolean
        allowDirectMarketingFromPartners:boolean
    }

    export interface MobilePhoneNumber {
        countryCallingCode:string
        localNumber:string
    }

    export type ROLE = 'FAN' | 'ADMIN' | 'TRANSLATOR' | 'FAN_GROUP_OWNER'

    export interface Address {
        /**
         * @format alpha-2 country code
         */
        countryCode: string,
        street: string,
        zipCode: string,
        city: string,
        line1: string
        line2: string
        line3: string
        state: string
        number: string,
        country: string,
    }

    export interface InvoiceInfo {
        /**
         * VAT number
         */
        vatNumber: string,

        /**
         * Invoice address
         */
        address: Address,
        
        /**
         * Name on the invoice
         */
        name: string,
    }

    export type TITLE = 'MR' | 'MS'

    export interface PersonalInfo {
        birthDate: string,
        idNumber: string,
        title: TITLE,
        citizenshipCountryCode: string,
        address: Address,
    }

    export interface Fan {
        /**
         * Fan's notification preferences
         */
        notificationChannels: NotificationChannels

        /**
         * Fan's marketing preferences
         */
        directMarketingSettings: DirectMarketingSettings

        /**
         * Fan's first name
         */
        firstName: string,
        
        /**
         * Fan's last name.
         */
        lastName: string,
        
        /**
         * Fan's mobile phone number
         */
        mobilePhoneNumber: MobilePhoneNumber,
        
        /**
         * Fan's username
         */
        username: string,

        /**
         * Fan's email
         */
        email: string,
        
        /**
         * Fan's roles
         */
        roles: ROLE[],

        /**
         * Fan's invoice data
         */
        invoiceInfo: InvoiceInfo,

        validatedEmail: boolean,

        validatedMobilePhone: boolean,

        personalInfo: PersonalInfo, 

        /**
         * Fan's full name
         */
        name: string,

        /**
         * Fan's language
         */
        language: string,
    }

    export type ACCESS_MODE = 'PUBLIC' | 'PRIVATE' | 'CODE_PROTECTED';

    export type VISIBILITY = 'VISIBLE' | 'INVISIBLE';

    export interface Statistics {
        /**
         * The number of Seats of Fan in FanGroup
         */
        numberOfSeats: number,

        /**
         * The number of FanGroup's members
         */
        numberOfMembers: number,

        /**
         * The number of Waiting Lists in FanGroup
         */
        numberOfWaitingLists: number,

        /**
         * The number of Waiting Lists joined by Fan in FanGroup
         */
        numberOfJoinedWaitingLists: number,
    }

    export type INVITATION_STATUS =
        'PENDING' | 'IGNORED' | 'ACCEPTED';

    export interface Invitation {
        /**
         * Invitation's status
         */
        status: INVITATION_STATUS
    }

    export type FG_REQUEST_STATUS =
        'PENDING' | 'ACCEPTED' | 'REJECTED';


    export interface FanGroupRequest {
        /**
         * The reason of rejection
         */
        rejectionReason: string,

        /**
         * Request's status
         */
        status: FG_REQUEST_STATUS
    }

    export interface Membership {
        /**
         * An invitation if available, null otherwise
         */
        invitation: Invitation,

        /**
         * The request to join if available, null otherwise
         */
        request: FanGroupRequest,

        /**
         * True if Fan is member of the Fan Group
         */
        member: boolean,
    }

    export interface FanGroupCategory {
        /**
         * Category name, translated in the fan's locale
         */
        translatedName: string,

        /**
         * Category's name: {string=>string}
         * @deprecated use translatedName
         */
        name: any,

        /**
         * Category's ID
         * @format UUID
         */
        id: string
    }

    export interface FanGroup {
        /**
         * FanGroup's slug
         */
        slug: string,

        /**
         * FanGroup's welcome text: {string=>string}
         * @deprecated use translatedWelcomeText
         */
        welcomeText: any,

        /**
         * How to get the protection code, translated in user locale
         */
        protectionCodeExplanation: string

        /**
         * FanGroup's access mode
         */
        accessMode: ACCESS_MODE,

        /**
         * FanGroup's visibility
         */
        visibility: VISIBILITY,

        /**
         * True if authenticated fan is member of the FanGroup
         */
        fanMember: boolean,

        /**
         * FanGroup statistics
         */
        statistics: Statistics,

        /**
         * FanGroup's short name: {string=>string}
         * @deprecated use translatedShortName
         */
        shortName: any,

        /**
         * FanGroup's color 1
         */
        color1: string,

        /**
         * FanGroup's cover image
         */
        coverImageUrl: string,

        /**
         * FanGroup's profile image
         */
        backgroundImageUrl: string,

        /**
         * FanGroup's color 2
         */
        color2: string,

        /**
         * A description of the membership of the Fan to the Fan Group
         */
        membership: Membership,

        /**
         * Fan Group's short name, translated in fan locale
         */
        translatedShortName: string,

        /**
         * Fan Group's welcome text, translated in fan locale
         */
        translatedWelcomeText: string,

        /**
         * Fan Group categories
         */
        groupCategories: FanGroupCategory[],

        /**
         * Fan Group's name, translated in fan locale
         */
        translatedName: string,

        /**
         * FanGroup's profile image
         */
        profileImageUrl: string,

        /**
         * FanGroup's name: {string=>string}
         * @deprecated use translatedName
         */
        name: any,

        /**
         * FanGroup's ID
         * @format UUID
         */
        id: string,
    }

    export type WL_ACCESS_MODE =
        'PUBLIC' | 'CODE_PROTECTED';

    export type SEAT_DISTRIBUTION_MODE =
        'VOUCHER' | 'TICKET';

    export type WL_STATUS =
        'SETUP' | 'DRAFT' | 'PUBLISHED' | 'OPEN' | 'CLOSED' | 'ARCHIVED';

    export interface Price {
        /**
         * Number of seats requested by the fan
         */
        numberOfSeats: number,

        /**
         * Seat's facial price
         */
        facialPrice: number,

        /**
         * Total facial price of requested seats
         */
        totalFacialPrice: number,

        /**
         * numberTotal fee
         */
        fee: number,

        /**
         * Fee on total facial price excluding VAT
         */
        feeExcVat: number,

        /**
         * VAT computed on fee 
         */
        feeVat: number,

        /**
         * 
         */
        formattedFacialPrice: string,

        /**
         * 
         */
        formattedTotalFacialPrice: string,
        
        /**
         * 
         */
        formattedFeeExcVat: string,

        /**
         * 
         */
        formattedFeeVat: string,

        /**
         * 
         */
        formattedFee: string,

        /**
         *
         */
        formattedTotal: string,

        /**
         * Total price for the requested seats
         */
        total: number,
    }

    export type WL_REQUEST_STATUS =
        'PENDING' | 'ACCEPTED' | 'REJECTED';

    export interface WaitingListRequest {
        /**
         * The reason of rejection
         */
        rejectionReason: string,

        /**
         * Request's status
         */
        status: WL_REQUEST_STATUS,
    }

    export type TICKETING_SYSTEM_TYPE =
        'DIGITICK' | 'VERITIX' | 'UPLOAD';

    export type DELIVERY_METHOD =
        'DOWNLOAD' | 'EMAIL';

    export type SEAT_STATUS =
        'ASSIGNED' | 'ACCEPTED' | 'REJECTED' | 'ARCHIVED';

    export interface Seat {
        /**
         * Seat number
         */
        voucherNumber: string
        
        /**
         * Ticketing System Type
         */
        ticketingSystemType: TICKETING_SYSTEM_TYPE,

        /**
         * Ticket delivery method
         */
        deliveryMethod: DELIVERY_METHOD,

        /**
         * Assignment expiration date 
         * @format ISO_8601
         */
        assignmentExpirationDate: string,

        /**
         * Where to download the exported voucher, if any
         */
        exportedVoucherUrl: string,

        /**
         * Seat status
         */
        status: SEAT_STATUS,
        
        /**
         * Seat text: {string =>string}
         */
        seatText: any
    }

    export interface FanGroupCategory {
        /**
         * Fan Group category name
         */
        translatedName: string,

        /**
         * Category's name: {string=>string}
         * @deprecated use translatedName
         */
        name: any,
        
        /**
         * Category's ID
         * @format UUID
         */
        id: string
    }

    export interface FeeCalculationParameters {
        /**
         * % added to cover distribution costs
         */
        distributionRate: number,

        /**
         * Minimum distribution cost
         */
        minDistributionFee: number,

        /**
         * Maximum distribution cost
         */
        maxDistributionFee: number,

        /**
         * VAT rate that is applied (depends on venue country)
         */
        vatRate: number
    }

    export interface Currency {
        symbol: string,
        code: string
    }

    export type TRANSACTION_STATUS =
        'CREATING' | 'FAILURE' | 'CREATED' | 'APPROVED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDING' | 'REFUNDED';

    export type POSITION_STATUS =
        'BEING_PROCESSED' | 'WAITING_SEAT' | 'HAS_SEAT' | 'ARCHIVED';

    export interface Position {
        /**
         * When the position will expire
         * @format ISO_8601
         */
        expirationDate: string,

        /**
         * Number of Seats
         */
        numberOfSeats: number,

        /**
         * A description of the error that lead to FAILURE status
         */
        paymentFailureMessage: string,

        /**
         * Is personal info required to be able to accept the seats?
         */
        personalInfoRequired:boolean,

        /**
         * The payment status
         */
        transactionStatus: TRANSACTION_STATUS,

        /**
         * Is the likelihood of the fan to get his tickets considered low?
         */
        lowLikelihood: boolean,

        /**
         * The likelihood of the fan to get tickets (percentage)
         */
        likelihood: number,

        /**
         * Position status
         */
        status: POSITION_STATUS,

        /**
         * Position rank
         */
        rank: number,

        /**
         * Currency formatted total price for the requested # of tickets
         */
        formattedTotal: string,

        /**
         * Total price or null if Waiting List is free
         */
        total: number,

        /**
         * Total facial price (unit facial price times number of Seats)
         */
        facialPrice: number,

        /**
         * Total fee
         */
        fee: number,

        /**
         * Fee excluding VAT
         */
        feeExcVat: number,

        /**
         * Fee VAT
         */
        feeVat:number,

        /**
         * Facial price, formatted with currency
         */
        formattedFacialPrice: string,

        /**
         * Fee excluding VAT, formatted with currency
         */
        formattedFeeExcVat: string,

        /**
         * Fee VAT, formatted with currency
         */
        formattedFeeVat: string,

        /**
         * Fee incl VAT, formatted with currency
         */
        formattedFee: string,
    }

    export interface WaitingList {

        /**
         * Waiting List ID
         */
        waitingListId: string,

        /**
         * Event name: { string => string }
         * @deprecated use translatedEventName instead
         */
        eventName: any,

        /**
         * Seat category
         */
        seatCategory: string,

        /**
         * Translated text explaining how to obtain the code protecting this WL
         */
        protectionCodeExplanation: string,
        
        /**
         * The way to access this WL
         */
        accessMode: WL_ACCESS_MODE,

        /**
         * What kind of tickets are distributed
         */
        seatDistributionMode: SEAT_DISTRIBUTION_MODE,

        /**
         * When the event for this WL starts
         * @format ISO_8601
         */
        eventStartDate: string,

        /**
         * Price breakdown for the # of ordered ticket(s) or for one single ticket 
         */
        price: Price,

        /**
         * Wether direct sales is enabled for this WL, meaning the fan can receive his
         * seats immediately if available, without the need for manual distribution.
         */
        directSalesEnabled: boolean,

        /**
         * Waiting List status
         */
        waitingListStatus: WL_STATUS,

        /**
         * slug of the group (e.g. https://seaters.com/my-slug) 
         */
        groupSlug:string

        /**
         * Group short name: { string => string } 
         * @deprecated use translatedGroupShortName
         */    
        groupShortName: any,
        
        /**
         * Event short name: { string => string }
         * @deprecated use translatedEventShortName
         */
        eventShortName: any,

        /**
         * Venue name: { string => string }
         * @deprecated use translatedVenueName
         */
        venueName: any,
        
        /**
         * Venue short name: { string => string }
         * @deprecated use translatedVenueShortName
         */
        venueShortName: any,

        /**
         * Venue city: { string => string }
         * @deprecated use translatedVenueCity
         */
        venueCity: any,

        /**
         * Fan Group ID
         * @format UUID
         */
        groupId: string,

        /**
         * Join request status
         */
        request: WaitingListRequest,

        /**
         * Fan Group name: { string => string }
         * @deprecated use translatedGroupName
         */
        groupName: any,
        
        /**
         * Event image URL
         */
        eventImageUrl: string,

        /**
         * True if Waiting List is free, false otherwise.
         */
        freeWaitingList: boolean,
        
        /**
         * Seat data or null if Waiting List has no seat yet
         */
        seat: Seat,

        /**
         * FanGroup categories
         */
        groupCategories: FanGroupCategory[],

        /**
         * Fee calculation parameters
         */
        feeCalculationParameters: FeeCalculationParameters,
        
        /**
         * Fan Group profile image URL
         */
        groupProfileImageUrl: string,

        /**
         * Fan Group name, translated in fan's locale
         */
        translatedGroupName: string,

        /**
         * Group short name, translated in fan's locale
         */
        translatedShortGroupName: string,

        /**
         * Event name, translated in fan's locale
         */
        translatedEventName: string,

        /**
         * Event short name, translated in fan's locale
         */
        translatedEventShortName: string,

        /**
         * Venue name, translated in fan's locale
         */
        translatedVenueName: string,

        /**
         * Venue short name, translated in fan's locale
         */
        translatedVenueShortName: string,

        /**
         * Venue city, translated in fan's locale
         */
        translatedVenueCity: string,
        
        /**
         * Venue image URL
         */
        venueImageUrl: string,

        /**
         * Currency
         */
        currency: Currency,

        /**
         * Display name (wl name if available, otherwise venue category name)
         */
        displayName: string,

        /**
         * Position data or null if Waiting List is not yet joined
         */
        position: Position,

        /**
         * Maximum number of Seats a Fan can reserve when joining a Waiting List
         */
        maxNumberOfSeatsPerPosition: number,

        /**
         * Event end date
         */
        eventEndDate: string,
        
        /**
         * Venue country: {string =>string}
         * @deprecated use translatedVenueCountry
         */
        venueCountry: any,

        /**
         * Fan Group cover image URL
         */
        groupCoverImageUrl: string,

        /**
         * Fan Group background image URL
         */
        groupBackgroundImageUrl: string,
        
        /**
         * Venue country, translated in the fan's locale
         */
        translatedVenueCountry:string

        /**
         * Event description, translated in the fan's locale
         */
        translatedEventDescription:string
    }

}