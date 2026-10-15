import { useEffect, useMemo, useRef, useState } from 'react'
import { Archive, ArrowDownToLine, ArrowLeft, ArrowUpFromLine, Bell, BookOpenCheck, BriefcaseBusiness, Building2, Check, ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, Cloud, File, FilePlus2, FileText, Folder, House, LayoutDashboard, Menu, MoreHorizontal, Pencil, Plus, Search, Settings, ShieldCheck, Sparkles, Users, Wifi, WifiOff, X } from 'lucide-react'

type Business = { id: string; name: string; subtitle: string; icon: string; color: string }
type Doc = { id: string; businessId: string; title: string; category: string; content: string; updatedAt: string; type: string; pinned?: boolean; fileData?: string; mimeType?: string; fileSize?: number; policyData?: PolicyForm; temperatureData?: TemperatureRecordForm; temperatureMonitoringData?: TemperatureRecordForm; openingClosingData?: OpeningClosingForm; cleaningData?: CleaningRecordForm; supplierDeliveryData?: SupplierDeliveryForm; storageRotationData?: StorageRotationForm; foodProcessData?: FoodProcessForm; hygienePolicyData?: HygienePolicyForm; managementPackData?: ManagementPackForm; allergenMatrixData?: AllergenMatrixForm; allergenManagementData?: AllergenManagementForm; pestWasteWaterData?: PestWasteWaterForm; trainingRecordsData?: TrainingRecordsForm; documentReviewData?: DocumentReviewForm }
type SafetyItem = { id: string; title: string; detail: string; done: boolean }

const businesses: Business[] = [
  { id: 'kitchen', name: 'The Small Kitchen', subtitle: 'Food trailer & catering', icon: 'chef', color: 'mint' },
  { id: 'events', name: 'Wonderful Whimsical Events', subtitle: 'Events & wedding planning', icon: 'event', color: 'lilac' },
  { id: 'services', name: 'Cleaning & Property Services', subtitle: 'Cleaning and maintenance', icon: 'home', color: 'sand' },
]
const initialDocs: Doc[] = [
  { id: 'd1', businessId: 'kitchen', title: 'Food Safety Management Pack', category: 'Food safety', content: '# Food Safety Management Pack\n\nBusiness: The Small Kitchen\n\n## Purpose\nThis pack records the food safety procedures used by the business. Review it whenever equipment, menu items, premises or working practices change.\n\n## Before use\n- Confirm the procedures match the actual trailer setup.\n- Add business contact details and responsible persons.\n- Set safe limits using current Food Standards Agency guidance.\n- Train staff and keep completed monitoring records.\n\nThis is a starter template. It is not a completed or approved food safety system.', updatedAt: 'Starter template', type: 'document', pinned: true },
  { id: 'd2', businessId: 'kitchen', title: 'Daily Opening & Closing Checks', category: 'Daily records', content: '# Daily Opening & Closing Checks\n\nDate:\nPerson responsible:\n\n## Opening\n- [ ] Handwashing facilities ready\n- [ ] Work surfaces and utensils clean\n- [ ] Fridge and freezer temperatures checked against the business limits\n- [ ] Equipment and gas safety checks completed as applicable\n- [ ] Allergen information available and current\n\n## Closing\n- [ ] Food safely stored or discarded\n- [ ] Cleaning completed and recorded\n- [ ] Waste removed and bins secured\n- [ ] Equipment safely shut down\n\n## Issues and corrective action\nIssue:\nAction taken:\nFollow-up required:', updatedAt: 'Starter template', type: 'record' },
  { id: 'd3', businessId: 'kitchen', title: 'Temperature Monitoring Log', category: 'Temperature records', content: '# Temperature Monitoring Log\n\nDate | Equipment / food | Reading | Required limit | Action if outside limit | Initials\n\nRecord actual readings at the frequency set in your food safety procedures. If a reading is outside the required limit, record the corrective action and verify the food is safe before use.', updatedAt: 'Starter template', type: 'record' },
  { id: 'd4', businessId: 'kitchen', title: 'Allergen Matrix — Menu', category: 'Folder 2 — Food Handling & Storage', content: '# Allergen Matrix — Menu\n\nAdd each menu item and verify the ingredients and allergen information against current supplier labels and recipes.\n\nMenu item | Ingredient source checked | Allergens present | Cross-contact controls | Checked by | Date\n\nNever guess allergen information. Update this matrix whenever a recipe, supplier or ingredient changes.', updatedAt: 'Starter template', type: 'document' },
  { id: 'fs1', businessId: 'kitchen', title: 'Food safety management overview', category: 'Folder 1 — Food Safety Management', content: '# Food Safety Management Overview\n\nBusiness: The Small Kitchen\nResponsible person:\nReview date:\n\n## How this system is used\nKeep this folder as the central record of the food safety procedures and checks used by the food trailer. Complete records at the time of the check, record actual readings and actions, and review procedures whenever the menu, equipment, suppliers, premises or working methods change.\n\n## Daily controls\n- Check the trailer and handwashing facilities before work.\n- Check and record refrigeration, cooking and hot-holding controls where applicable.\n- Prevent raw-to-ready-to-eat cross-contamination.\n- Keep current ingredient and allergen information available.\n- Clean and disinfect according to the schedule.\n- Record problems and corrective actions.\n\nThis is a starter template. Adapt it to your actual operation and current Food Standards Agency guidance before use.', updatedAt: 'Starter template', type: 'document', pinned: true },
  { id: 'fs2-v2', businessId: 'kitchen', title: 'Food safety policy and responsibilities', category: 'Folder 1 — Food Safety Management', content: '# Food Safety Policy and Responsibilities\n\nBusiness: The Small Kitchen\nFood safety lead:\nDeputy / cover:\nEffective date:\nReview date:\n\n## Policy\nWe will prepare and serve food safely, follow applicable food hygiene requirements, give accurate allergen information, maintain clean equipment and facilities, and keep truthful records.\n\n## Responsibilities\n- Owner / food safety lead: maintain procedures, check records, arrange training and act on problems.\n- Food handlers: follow safe methods, wash hands, prevent cross-contamination, report illness and record assigned checks.\n- Person in charge each shift:\n\n## Reporting\nReport unsafe food, temperature failures, allergen mistakes, pests, water problems, illness or equipment faults immediately. Record the action taken and who verified it.', updatedAt: 'Starter template', type: 'document' },
  { id: 'fs3', businessId: 'kitchen', title: 'Daily temperature records', category: 'Folder 1 — Food Safety Management', content: '# Daily Temperature Records\n\nDate:\nPerson completing checks:\n\nTime | Equipment / food | Actual temperature (°C) | Business limit | Pass / fail | Corrective action | Initials\n\n\nRecord actual readings at the frequency set in the food safety procedures. Use a suitable, clean thermometer where required. Do not write a guessed reading. If a limit is missed, assess the food, take safe corrective action and record what happened. Set limits using current official guidance and the specific food and process.', updatedAt: 'Starter template', type: 'record' },
  { id: 'fs4', businessId: 'kitchen', title: 'Cleaning and disinfection schedule and records', category: 'Folder 1 — Food Safety Management', content: '# Cleaning and Disinfection Schedule and Records\n\nDate | Area / item | Product and dilution (label instructions) | Method / contact time | Frequency | Completed by | Checked by | Issue / action\n\nAreas to include as applicable: food-contact surfaces, utensils, fryer and cooker surfaces, fridge handles and shelves, food warmer, sinks, handwashing points, floors, bins, storage areas and vehicle touchpoints. Clean first, then disinfect food-contact surfaces using a suitable product according to its label. Keep chemicals away from food and utensils.', updatedAt: 'Starter template', type: 'record' },
  { id: 'fs5', businessId: 'kitchen', title: 'Allergen management policy and allergen matrix', category: 'Folder 2 — Food Handling & Storage', content: '# Allergen Management Policy and Allergen Matrix\n\nResponsible person:\nLast verified:\n\n## Policy\nNever guess allergen information. Check recipes, every ingredient label and supplier information. Prevent cross-contact, keep packaging available for verification and update the matrix whenever a recipe, product or supplier changes. If information cannot be verified, do not claim a dish is allergen-free.\n\n## Menu matrix\nMenu item | Ingredient / brand | Cereals containing gluten | Crustaceans | Eggs | Fish | Peanuts | Soybeans | Milk | Nuts | Celery | Mustard | Sesame | Sulphur dioxide / sulphites | Lupin | Molluscs | Cross-contact controls | Checked by / date\n\nFill in only after checking current product labels and recipes. This blank matrix is not verified allergen advice.', updatedAt: 'Starter template', type: 'document' },
  { id: 'fs6', businessId: 'kitchen', title: 'Supplier and delivery records', category: 'Folder 2 — Food Handling & Storage', content: '# Supplier and Delivery Records\n\nDate / time | Supplier | Product and quantity | Batch / use-by details where relevant | Packaging / condition | Temperature where applicable | Accepted / rejected | Issue and action | Checked by\n\nKeep supplier invoices and traceability information. Reject or isolate deliveries that are unsafe, damaged, contaminated or outside your defined acceptance criteria. Record the reason and contact the supplier.', updatedAt: 'Starter template', type: 'record' },
  { id: 'fs7', businessId: 'kitchen', title: 'Food storage and stock rotation records', category: 'Folder 2 — Food Handling & Storage', content: '# Food Storage and Stock Rotation Records\n\nDate | Product | Batch / use-by date | Storage location | Date opened / prepared | Rotation check | Discard date / action | Initials\n\nStore food covered, labelled and at the correct conditions. Separate raw foods from ready-to-eat foods and keep chemicals separate from food. Use stock rotation appropriate to the product, follow use-by dates and any after-opening instructions, and discard food when safety cannot be assured.', updatedAt: 'Starter template', type: 'record' },
  { id: 'fs8', businessId: 'kitchen', title: 'Food preparation, cooking, cooling and reheating procedures', category: 'Folder 1 — Food Safety Management', content: '# Food Preparation, Cooking, Cooling and Reheating Procedures\n\n## Preparation\n- Wash hands and use clean, sanitised equipment.\n- Keep raw and ready-to-eat food separate; use suitable separate or fully cleaned utensils and surfaces.\n- Thaw and handle food according to its instructions and safe procedures.\n\n## Cooking\n- Follow a validated safe cooking method for each food. Check the centre of relevant foods with a clean probe thermometer and record results where required.\n\n## Cooling and reheating\n- Avoid keeping food at room temperature unnecessarily. Cool food promptly using a safe method and appropriate shallow containers / portion sizes.\n- Reheat thoroughly according to your documented safe method and verify the centre temperature where required.\n- Do not repeatedly cool and reheat food.\n\nFood-specific limits and methods must be confirmed against current Food Standards Agency guidance and the actual menu. Record checks and corrective actions.', updatedAt: 'Starter template', type: 'document' },
  { id: 'fs9', businessId: 'kitchen', title: 'Personal hygiene and staff illness policy', category: 'Folder 1 — Food Safety Management', content: '# Personal Hygiene and Staff Illness Policy\n\n## Personal hygiene\n- Wear clean work clothing and keep hair restrained as appropriate.\n- Wash hands thoroughly at the handwashing point before handling food and after toilet use, handling raw food, waste, phones, money, cleaning or any contamination risk.\n- Cover cuts with a suitable waterproof dressing and use gloves where appropriate. Gloves do not replace handwashing.\n- Do not eat, smoke or vape in food handling areas.\n\n## Illness reporting\nTell the person in charge about vomiting, diarrhoea, infected wounds, jaundice or other potentially infectious symptoms before starting work. Do not handle food while unfit. Follow current official exclusion and return-to-work guidance and record the decision.\n\nPerson responsible for decisions:\nStaff briefing / acknowledgement records:', updatedAt: 'Starter template', type: 'document' },
  { id: 'fs10', businessId: 'kitchen', title: 'Pest control, waste and water safety records', category: 'Folder 1 — Food Safety Management', content: '# Pest Control, Waste and Water Safety Records\n\nDate | Check type | Findings | Action taken | Person responsible | Follow-up / verification\n\n## Pest prevention\nInspect for signs of pests, keep doors and openings controlled where practical, protect food, and record sightings and action. Use competent pest control support when needed.\n\n## Waste\nKeep waste in suitable containers, remove it frequently and keep waste away from food and clean equipment. Record any waste collection or issue relevant to food safety.\n\n## Water safety\nRecord the water source, potable-water arrangements, tank cleaning / disinfection and refill checks as applicable. Keep fresh water and wastewater separate, protect connections and do not use water of uncertain safety for food handling or handwashing.', updatedAt: 'Starter template', type: 'record' },
  { id: 'fs11', businessId: 'kitchen', title: 'Opening and closing checklists', category: 'Folder 1 — Food Safety Management', content: '# Opening and Closing Checklists\n\nDate:\nPerson responsible:\n\n## Opening checklist\n- [ ] Potable fresh water available; wastewater capacity adequate\n- [ ] Handwashing facilities stocked and working\n- [ ] Work surfaces and utensils clean and ready\n- [ ] Refrigeration / freezer checks completed as applicable\n- [ ] Equipment, gas and electrical checks completed as applicable\n- [ ] Food protected, in date and stored correctly\n- [ ] Current allergen information accessible\n- [ ] Pest / damage / maintenance concerns checked\n\n## Closing checklist\n- [ ] Food labelled and safely stored or discarded\n- [ ] Cleaning and disinfection completed and recorded\n- [ ] Waste removed and bins secured\n- [ ] Fresh / wastewater systems handled safely as applicable\n- [ ] Equipment safely shut down\n- [ ] Issues and corrective actions recorded\n\nIssues / action / initials:', updatedAt: 'Starter template', type: 'record' },
  { id: 'fs12', businessId: 'kitchen', title: 'Corrective actions and incident records', category: 'Folder 1 — Food Safety Management', content: '# Corrective Actions and Incident Records\n\nDate / time | Incident or failed check | Food / equipment affected | Immediate action | Food safety decision (retain / isolate / discard) | Person responsible | Root cause / prevention | Follow-up and verification | Closed by / date\n\nRecord facts promptly. Do not sell food where safety is uncertain. Escalate suspected allergen incidents, contamination, illness, loss of water, pest activity or equipment failure appropriately and retain relevant traceability details.', updatedAt: 'Starter template', type: 'record' },
  { id: 'fs13', businessId: 'kitchen', title: 'Food safety training records', category: 'Folder 1 — Food Safety Management', content: '# Food Safety Training Records\n\nStaff member | Role | Training / instruction | Date completed | Trainer / provider | Evidence / certificate location | Refresher due | Additional support needed | Signature / acknowledgement\n\nInclude induction, handwashing, cross-contamination prevention, allergen awareness, temperature checks, cleaning, illness reporting, safe equipment use and emergency procedures as relevant to each role. Training should match the tasks performed and be refreshed when procedures change.', updatedAt: 'Starter template', type: 'record' },
  { id: 'fs14', businessId: 'kitchen', title: 'Document review and update log', category: 'Folder 1 — Food Safety Management', content: '# Document Review and Update Log\n\nDocument / procedure | Version | Review date | Reason for review / change | Changes made | Reviewed by | Staff briefed (date) | Next review date\n\nReview the food safety system when menus, recipes, suppliers, equipment, layout, water arrangements, premises, staff responsibilities or working practices change, and after incidents or when guidance changes. Keep superseded versions clearly identified so they are not used by mistake.', updatedAt: 'Starter template', type: 'record' },
  { id: 'd5', businessId: 'events', title: 'Client Event Brief', category: 'Client documents', content: '# Client Event Brief\n\nClient name:\nEvent date:\nVenue:\nGuest numbers:\nBudget:\nTheme and styling:\nSuppliers:\nAccess and setup times:\nKey contacts:\nRisks and contingency plan:\nNext actions:', updatedAt: 'Starter template', type: 'document' },
  { id: 'd6', businessId: 'services', title: 'Job Risk Assessment', category: 'Health & safety', content: '# Job Risk Assessment\n\nJob / location:\nDate:\nPerson responsible:\nTask description:\nHazards identified:\nWho may be harmed:\nControls in place:\nFurther action required:\nReview date:', updatedAt: 'Starter template', type: 'document' },
]
const foodHandlingCategory = 'Folder 2 — Food Handling & Storage'
function normalizeFoodHandlingCategories(items: Doc[]): Doc[] {
  let changed = false
  const normalized = items.map(doc => {
    const title = doc.title.trim().toLowerCase()
    const belongsInFoodHandling = doc.businessId === 'kitchen' && (
      ['d4', 'fs5', 'fs6', 'fs7'].includes(doc.id) ||
      title === 'allergen matrix — menu' ||
      title === 'allergen management policy and allergen matrix' ||
      title === 'supplier and delivery records' ||
      title === 'food storage and stock rotation records'
    )
    if (!belongsInFoodHandling || doc.category === foodHandlingCategory) return doc
    changed = true
    return { ...doc, category: foodHandlingCategory }
  })
  return changed ? normalized : items
}
const safetyInitial: SafetyItem[] = [
  { id: 's1', title: 'Food safety management pack', detail: 'Safe methods, responsibilities and review notes', done: false },
  { id: 's2', title: 'Opening and closing checks', detail: 'Setup, hygiene and end-of-day records', done: false },
  { id: 's3', title: 'Temperature monitoring', detail: 'Fridge, freezer, cooking and hot holding as applicable', done: false },
  { id: 's4', title: 'Cleaning schedule', detail: 'Equipment, surfaces and cleaning sign-offs', done: false },
  { id: 's5', title: 'Allergen matrix', detail: 'Menu ingredients, labels and customer information', done: false },
  { id: 's6', title: 'Deliveries and traceability', detail: 'Supplier details, checks and rejected goods', done: false },
  { id: 's7', title: 'Corrective action log', detail: 'Problems, actions, responsible person and verification', done: false },
  { id: 's8', title: 'Staff training and supporting documents', detail: 'Training, maintenance and relevant certificates', done: false },
]
const prettyDate = (value: string) => value === 'Starter template' ? value : new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

type OverviewForm = {
  businessName: string; responsiblePerson: string; businessAddress: string; contactPhone: string; contactEmail: string;
  tradingLocation: string; preparationLocation: string; foodTypes: string; serviceStyle: string;
  staffCount: string; waterSupply: string; wastewater: string; refrigeration: string;
  hotHolding: string; trainingStatus: string; reviewDate: string; notes: string;
}
const emptyOverviewForm: OverviewForm = {
  businessName: 'The Small Kitchen', responsiblePerson: '', businessAddress: '', contactPhone: '', contactEmail: '',
  tradingLocation: '', preparationLocation: 'Trailer only', foodTypes: 'Hot food prepared and served',
  serviceStyle: 'Made to order', staffCount: 'Owner only', waterSupply: 'Fresh-water tank',
  wastewater: 'Separate wastewater tank', refrigeration: 'Fridge and/or freezer used as required',
  hotHolding: 'Hot holding equipment used where required', trainingStatus: 'To be confirmed',
  reviewDate: '', notes: ''
}

type PolicyForm = {
  foodSafetyLead: string; foodSafetyLeadName: string; deputy: string; effectiveDate: string; reviewDate: string;
  businessName: string; businessAddress: string; tradingLocation: string; staffRoles: string;
  illnessReporting: string; training: string; allergenControl: string;
  recordKeeping: string; reviewFrequency: string; signedBy: string; notes: string; policyNotes: string; shiftResponsibilities: string; illnessNotes: string; recordNotes: string;
  ownerResponsibilities: string; handlerResponsibilities: string; cleaningResponsibilities: string; crossContamination: string; temperatureControl: string; correctiveActions: string;
}
type TemperatureCheck = { time: string; item: string; actual: string; limit: string; result: string; action: string; initials: string }
type TemperatureRecordForm = { date: string; completedBy: string; checks: TemperatureCheck[]; notes: string }
const blankTemperatureCheck = (): TemperatureCheck => ({ time: '', item: '', actual: '', limit: '', result: '', action: '', initials: '' })
const emptyTemperatureRecord: TemperatureRecordForm = { date: '', completedBy: '', checks: [blankTemperatureCheck()], notes: '' }
type OpeningClosingItem = { label: string; status: string; action: string }
type OpeningClosingForm = { date: string; responsible: string; opening: OpeningClosingItem[]; closing: OpeningClosingItem[]; issue: string; action: string; followUp: string }
type CleaningRecord = { area: string; product: string; method: string; frequency: string; status: string; completedBy: string; checkedBy: string; issue: string }
type CleaningRecordForm = { date: string; records: CleaningRecord[]; notes: string }
const blankCleaningRecord = (): CleaningRecord => ({ area: '', product: '', method: '', frequency: '', status: 'Not done', completedBy: '', checkedBy: '', issue: '' })
const emptyCleaningRecordForm: CleaningRecordForm = { date: '', records: [blankCleaningRecord()], notes: '' }
type SupplierDelivery = { time: string; supplier: string; product: string; quantity: string; batchUseBy: string; condition: string; temperature: string; decision: string; issueAction: string; checkedBy: string }
type SupplierDeliveryForm = { date: string; records: SupplierDelivery[]; notes: string }
const blankSupplierDelivery = (): SupplierDelivery => ({ time: '', supplier: '', product: '', quantity: '', batchUseBy: '', condition: '', temperature: '', decision: 'Not checked', issueAction: '', checkedBy: '' })
const emptySupplierDeliveryForm: SupplierDeliveryForm = { date: '', records: [blankSupplierDelivery()], notes: '' }
type StorageRotationRecord = { product: string; batchUseBy: string; location: string; openedPrepared: string; rotation: string; discardAction: string; initials: string }
type StorageRotationForm = { date: string; records: StorageRotationRecord[]; notes: string }
const blankStorageRotationRecord = (): StorageRotationRecord => ({ product: '', batchUseBy: '', location: '', openedPrepared: '', rotation: 'Not checked', discardAction: '', initials: '' })
const emptyStorageRotationForm: StorageRotationForm = { date: '', records: [blankStorageRotationRecord()], notes: '' }
type PestWasteWaterRecord = { date: string; recordType: string; location: string; findings: string; status: string; action: string; responsible: string; followUpDate: string; verifiedBy: string; waterSource: string; potable: string; tankService: string; separationCheck: string }
type PestWasteWaterForm = { records: PestWasteWaterRecord[]; notes: string }
const blankPestWasteWaterRecord = (): PestWasteWaterRecord => ({ date: '', recordType: '', location: '', findings: '', status: 'Not checked', action: '', responsible: '', followUpDate: '', verifiedBy: '', waterSource: '', potable: 'Not checked', tankService: '', separationCheck: 'Not checked' })
const emptyPestWasteWaterForm: PestWasteWaterForm = { records: [blankPestWasteWaterRecord()], notes: '' }
type TrainingRecord = { staffMember: string; role: string; training: string; status: string; dateCompleted: string; trainer: string; evidence: string; refresherDue: string; support: string; acknowledgement: string }
type TrainingRecordsForm = { records: TrainingRecord[]; notes: string }
type DocumentReviewRecord = { document: string; version: string; reviewDate: string; reason: string; outcome: string; changes: string; reviewedBy: string; staffBriefedDate: string; nextReviewDate: string; supersededReference: string }
type DocumentReviewForm = { records: DocumentReviewRecord[]; notes: string }
const blankTrainingRecord = (): TrainingRecord => ({ staffMember: '', role: '', training: '', status: 'Not recorded', dateCompleted: '', trainer: '', evidence: '', refresherDue: '', support: '', acknowledgement: '' })
const emptyTrainingRecordsForm: TrainingRecordsForm = { records: [blankTrainingRecord()], notes: '' }
const blankDocumentReviewRecord = (): DocumentReviewRecord => ({ document: '', version: '', reviewDate: '', reason: '', outcome: 'Not recorded', changes: '', reviewedBy: '', staffBriefedDate: '', nextReviewDate: '', supersededReference: '' })
const emptyDocumentReviewForm: DocumentReviewForm = { records: [blankDocumentReviewRecord()], notes: '' }
type FoodProcessStep = { method: string; limit: string; monitoring: string; correctiveAction: string }
type FoodProcessForm = { business: string; responsible: string; reviewDate: string; preparation: FoodProcessStep; cooking: FoodProcessStep; cooling: FoodProcessStep; reheating: FoodProcessStep; notes: string }
const blankFoodProcessStep = (): FoodProcessStep => ({ method: '', limit: '', monitoring: '', correctiveAction: '' })
const emptyFoodProcessStepForm: FoodProcessForm = { business: 'The Small Kitchen', responsible: '', reviewDate: '', preparation: blankFoodProcessStep(), cooking: { ...blankFoodProcessStep(), limit: 'Use 70°C for 2 minutes at the centre, or an equivalent time/temperature combination in current Food Standards Agency guidance, unless a validated product-specific method applies.' }, cooling: blankFoodProcessStep(), reheating: { ...blankFoodProcessStep(), limit: 'Reheat until steaming hot throughout; reheat only once.' }, notes: '' }
type HygienePolicyForm = { business: string; responsible: string; reviewDate: string; handwashing: string; clothing: string; wounds: string; hygiene: string; symptoms: string; exclusion: string; returnToWork: string; reportingRoute: string; assessment: string; training: string; records: string; notes: string }
const emptyHygienePolicyForm: HygienePolicyForm = { business: 'The Small Kitchen', responsible: '', reviewDate: '', handwashing: 'Wash hands thoroughly with warm water and soap at the designated handwashing basin. Wash before handling food and after using the toilet, handling raw food, waste, phones or money, cleaning, touching face or hair, and whenever hands may be contaminated. Dry hands hygienically. Gloves do not replace handwashing.', clothing: 'Wear clean work clothing and keep hair restrained as appropriate. Change contaminated clothing before handling food. Keep personal items away from food and food-contact equipment.', wounds: 'Cover cuts, sores and wounds with a suitable brightly coloured waterproof dressing. Keep infected or weeping wounds covered and report them to the person in charge before food handling. Use gloves only as an additional control where appropriate.', hygiene: 'Do not eat, smoke or vape in food handling areas. Keep nails and personal cleanliness suitable for food handling. Avoid touching ready-to-eat food with bare hands where practical controls require utensils or gloves.', symptoms: 'Tell the person in charge before starting work if you have diarrhoea, vomiting, stomach pain or nausea, fever, jaundice, an infected wound or skin infection, or another potentially infectious illness. Also report relevant illness in household contacts if instructed by current official guidance. Do not hide symptoms.', exclusion: 'Anyone with diarrhoea or vomiting must not handle food while symptomatic. The person in charge assesses the risk, keeps the staff member away from food handling, protects food and surfaces from contamination, and records the decision and any action. Seek health or local authority advice for diagnosed infections, persistent symptoms or uncertainty.', returnToWork: 'After diarrhoea or vomiting, return to food handling only after being free of symptoms for at least 48 hours. Some infections or circumstances require a longer exclusion or specific clearance; follow current official advice and any instruction from a medical professional or local authority.', reportingRoute: 'Report to the shift lead or food safety lead before the shift, by phone or in person. If unavailable, contact the named deputy. Do not attend to handle food until the person in charge has discussed fitness for work and agreed the next step.', assessment: 'Record symptoms, onset and last symptom date, relevant diagnosis or advice, duties affected, precautions, decision maker and review date. Share only information needed to manage food safety. If fitness is uncertain, keep the person away from food handling while advice is obtained.', training: 'Brief every food handler on handwashing, clean clothing, wound covering, symptom reporting, exclusion and return-to-work rules before they handle food. Refresh when procedures change and supervise day-to-day practice.', records: 'Keep confidential illness reports and return-to-work decisions securely, with the date, staff member, reported facts, decision, action, advice followed and person authorising return. Keep training and briefing acknowledgements with staff training records.', notes: '' }
type ManagementPackForm = { business: string; responsible: string; deputy: string; operation: string; menu: string; preparation: string; crossContamination: string; temperature: string; cleaning: string; allergens: string; deliveries: string; storage: string; illness: string; correctiveActions: string; training: string; reviewFrequency: string; reviewDate: string; records: string; notes: string }
const emptyManagementPackForm: ManagementPackForm = { business: 'The Small Kitchen', responsible: '', deputy: '', operation: '', menu: '', preparation: '', crossContamination: '', temperature: '', cleaning: '', allergens: '', deliveries: '', storage: '', illness: '', correctiveActions: '', training: '', reviewFrequency: 'At least annually and whenever something changes', reviewDate: '', records: '', notes: '' }
const regulatedAllergens = ['Celery', 'Cereals containing gluten', 'Crustaceans', 'Eggs', 'Fish', 'Lupin', 'Milk', 'Molluscs', 'Mustard', 'Peanuts', 'Sesame', 'Soybeans', 'Sulphur dioxide / sulphites', 'Tree nuts']
type AllergenMenuItem = { name: string; ingredients: string; allergens: string[]; crossContact: string; verifiedBy: string; verifiedDate: string }
type AllergenMatrixForm = { business: string; lastReviewed: string; items: AllergenMenuItem[]; notes: string }
const blankAllergenMenuItem = (): AllergenMenuItem => ({ name: '', ingredients: '', allergens: [], crossContact: '', verifiedBy: '', verifiedDate: '' })
const emptyAllergenMatrix: AllergenMatrixForm = { business: 'The Small Kitchen', lastReviewed: '', items: [blankAllergenMenuItem()], notes: '' }
type AllergenManagementForm = { business: string; responsible: string; lastReviewed: string; ingredientChecks: string; recipeChanges: string; crossContact: string; customerInformation: string; staffTraining: string; ppds: string; matrix: AllergenMatrixForm; notes: string }
const emptyAllergenManagement: AllergenManagementForm = { business: 'The Small Kitchen', responsible: '', lastReviewed: '', ingredientChecks: 'Check the current recipe and every supplier label or product specification, including relevant processing aids.', recipeChanges: 'Recheck ingredients and update the menu matrix before using a substitution or changing a recipe or supplier.', crossContact: 'Store allergen-containing ingredients separately in closed, labelled containers. Clean utensils and surfaces and wash hands between preparations. Assess shared equipment and cooking oil.', customerInformation: 'Make current written allergen information available and support it with a conversation. If information cannot be verified, do not guess or give an assurance.', staffTraining: 'Train staff to find the current matrix and labels, handle customer questions, communicate orders to the kitchen and escalate uncertainty.', ppds: 'For prepacked for direct sale foods, check the full ingredients list and emphasise regulated allergens as required.', matrix: emptyAllergenMatrix, notes: '' }
const openingItems = ['Handwashing facilities ready', 'Work surfaces and utensils clean', 'Fridge and freezer temperatures checked against the business limits', 'Equipment and gas safety checks completed as applicable', 'Allergen information available and current']
const closingItems = ['Food safely stored or discarded', 'Cleaning completed and recorded', 'Waste removed and bins secured', 'Equipment safely shut down']
const checklistItems = (labels: string[]): OpeningClosingItem[] => labels.map(label => ({ label, status: 'Not checked', action: '' }))
const emptyOpeningClosingForm: OpeningClosingForm = { date: '', responsible: '', opening: checklistItems(openingItems), closing: checklistItems(closingItems), issue: '', action: '', followUp: '' }
const emptyPolicyForm: PolicyForm = {
  foodSafetyLead: '', foodSafetyLeadName: '', deputy: '', effectiveDate: '', reviewDate: '',
  businessName: 'The Small Kitchen', businessAddress: '', tradingLocation: '', staffRoles: 'Owner / food business operator',
  illnessReporting: 'Staff must report vomiting, diarrhoea, infected wounds or other symptoms before handling food',
  training: 'Training and supervision appropriate to duties; retain evidence of training',
  allergenControl: 'Check current supplier labels and recipes; provide accurate information and prevent cross-contact',
  recordKeeping: 'Complete records at the time checks are made; record actual results and corrective actions',
  reviewFrequency: 'At least annually and whenever the menu, process, equipment, premises or staff change',
  signedBy: '', notes: '', policyNotes: '', shiftResponsibilities: '', illnessNotes: '', recordNotes: '',
  ownerResponsibilities: 'Maintain suitable procedures, equipment and training; review records and act on problems.',
  handlerResponsibilities: 'Follow procedures, maintain hygiene, complete checks honestly, and report illness or unsafe conditions promptly.',
  cleaningResponsibilities: 'Clean first, then disinfect food-contact surfaces with a suitable product following its label and contact time; record completion and issues.',
  crossContamination: 'Keep raw and ready-to-eat food separate; use suitable dedicated or effectively cleaned equipment, utensils and work surfaces.',
  temperatureControl: 'Follow documented controls for chilled storage, cooking, cooling, reheating and hot holding as applicable; record actual checks and act on failures.',
  correctiveActions: 'Stop unsafe work, protect customers, isolate or discard affected food as appropriate, tell the person in charge, and record actions and follow-up.'
}

function isPolicyDocument(doc: Doc) {
  const title = doc.title.trim().toLowerCase()
  const content = doc.content.trimStart().toLowerCase()
  return Boolean(doc.policyData) || doc.id === 'fs2' || doc.id === 'fs2-v2' || title.includes('food safety policy and responsibilities') ||
    (doc.category.toLowerCase().includes('food safety') && (content.startsWith('# food safety policy and responsibilities') || content.includes('## 1. food safety policy') || content.includes('**food safety lead:**')))
}

function policyFormFromDocument(doc: Doc): PolicyForm {
  if (doc.policyData) return { ...emptyPolicyForm, ...doc.policyData }
  const field = (label: string) => {
    const safeLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return doc.content.match(new RegExp(`^(?:\\*\\*)?${safeLabel}(?:\\*\\*)?:\\s*(.*)$`, 'im'))?.[1]?.trim() ?? ''
  }
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ''
  const lead = field('Food safety lead')
  const [role = '', ...name] = lead.split(' — ')
  const savedSection = (heading: string) => doc.content.match(new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`, 'i'))?.[1]?.trim() ?? ''
  const savedChoice = (heading: string, choices: string[]) => {
    const text = savedSection(heading)
    return choices.find(choice => text.startsWith(choice)) ?? ''
  }
  return { ...emptyPolicyForm, businessName: field('Business') || emptyPolicyForm.businessName,
    foodSafetyLead: role === 'To be completed' ? '' : role, foodSafetyLeadName: name.join(' — '),
    deputy: field('Deputy / cover'), businessAddress: field('Business / correspondence address'),
    tradingLocation: field('Intended trading location'), effectiveDate: validDate(field('Effective date')),
    reviewDate: validDate(field('Review date')), signedBy: field('Approved / signed by') || field('Signature'),
    illnessReporting: savedChoice('3\\. Illness, wounds and fitness to handle food', [
      'Staff must report vomiting, diarrhoea, infected wounds or other symptoms before handling food',
      'Staff must report illness and follow the written illness procedure and current official guidance',
      'To be confirmed and written into the illness procedure'
    ]) || emptyPolicyForm.illnessReporting,
    training: savedChoice('4\\. Training and supervision', [
      'Training and supervision appropriate to duties; retain evidence of training',
      'Food handlers need induction before working and ongoing supervision',
      'Training arrangements still to be confirmed'
    ]) || emptyPolicyForm.training,
    allergenControl: savedChoice('5\\. Allergen management', [
      'Check current supplier labels and recipes; provide accurate information and prevent cross-contact',
      'Use a written allergen matrix and check every recipe and substitution',
      'Allergen procedure still to be completed before service'
    ]) || emptyPolicyForm.allergenControl,
    recordKeeping: savedChoice('6\\. Records and corrective action', [
      'Complete records at the time checks are made; record actual results and corrective actions',
      'Use daily checklists and keep temperature, cleaning, delivery and corrective-action records',
      'Record-keeping procedure still to be confirmed'
    ]) || emptyPolicyForm.recordKeeping,
    reviewFrequency: savedChoice('7\\. Review and approval', [
      'At least annually and whenever the menu, process, equipment, premises or staff change',
      'Every six months and whenever a significant change occurs',
      'Whenever a significant change occurs; set a routine review date'
    ]) || emptyPolicyForm.reviewFrequency,
    policyNotes: savedSection('Business-specific policy notes') || savedSection('Policy'), shiftResponsibilities: savedSection('Responsibilities and assigned shifts') || savedSection('Responsibilities'),
    illnessNotes: savedSection('Illness reporting and action'), recordNotes: savedSection('Records and reporting') || savedSection('Reporting') }
}

function migratePolicyDocumentDocs(docs: Doc[]): Doc[] {
  const policyTitle = 'food safety policy and responsibilities'
  const isLegacyPolicy = (doc: Doc) => doc.id === 'fs2' || doc.id === 'fs2-v2' || doc.title.trim().toLowerCase() === policyTitle
  const existing = docs.find(isLegacyPolicy)
  if (!existing) return docs
  const installed: Doc = {
    ...existing,
    id: 'fs2-v2',
    title: 'Food safety policy and responsibilities',
    category: 'Folder 1 — Food Safety Management',
    type: 'document',
    policyData: policyFormFromDocument(existing),
  }
  return [...docs.filter(doc => !isLegacyPolicy(doc)), installed]
}

function isDailyTemperatureDocument(doc: Doc) {
  return Boolean(doc.temperatureData) || doc.id === 'fs3' || doc.title.trim().toLowerCase() === 'daily temperature records'
}
function isTemperatureMonitoringLog(doc: Doc) {
  return Boolean(doc.temperatureMonitoringData) || doc.id === 'd3' || doc.title.trim().toLowerCase() === 'temperature monitoring log'
}
function temperatureMonitoringFormFromDocument(doc: Doc): TemperatureRecordForm {
  if (doc.temperatureMonitoringData) return { ...emptyTemperatureRecord, ...doc.temperatureMonitoringData, checks: doc.temperatureMonitoringData.checks?.length ? doc.temperatureMonitoringData.checks.map(check => ({ ...blankTemperatureCheck(), ...check })) : [blankTemperatureCheck()] }
  const lines = doc.content.split(/\r?\n/)
  const header = lines.findIndex(line => /equipment\s*\/\s*food/i.test(line) && /(reading|actual)/i.test(line))
  const checks: TemperatureCheck[] = []
  if (header >= 0) for (const line of lines.slice(header + 1)) {
    if (!line.includes('|') || /^\s*\|?\s*:?-{2,}/.test(line)) continue
    const c = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(v => v.trim())
    if (c.length < 4 || c.every(v => !v || /^:?-+:?$/.test(v))) continue
    checks.push({ time: c.length > 6 ? c[0] : '', item: c.length > 6 ? c[1] : c[1] || '', actual: c.length > 6 ? c[2] : c[2] || '', limit: c.length > 6 ? c[3] : c[3] || '', result: '', action: c.length > 6 ? c[5] || '' : c[4] || '', initials: c.length > 6 ? c[6] || '' : c[5] || '' })
  }
  const date = doc.content.match(/^Date:\s*(.*)$/im)?.[1]?.trim() || ''
  const completedBy = doc.content.match(/^Person completing checks:\s*(.*)$/im)?.[1]?.trim() || ''
  return { ...emptyTemperatureRecord, date, completedBy, checks: checks.length ? checks : [blankTemperatureCheck()] }
}

function temperatureRecordFromDocument(doc: Doc): TemperatureRecordForm {
  if (doc.temperatureData) return { ...emptyTemperatureRecord, ...doc.temperatureData, checks: doc.temperatureData.checks?.length ? doc.temperatureData.checks.map(check => ({ ...blankTemperatureCheck(), ...check })) : [blankTemperatureCheck()] }
  const field = (name: string) => doc.content.match(new RegExp(`^(?:\\*\\*)?${name}(?:\\*\\*)?:[ \\t]*(.*)$`, 'im'))?.[1]?.trim() ?? ''
  const lines = doc.content.split(/\r?\n/)
  const headerIndex = lines.findIndex(line => /time/i.test(line) && /equipment\s*\/\s*food/i.test(line) && /actual/i.test(line))
  const checks: TemperatureCheck[] = []
  if (headerIndex >= 0) {
    for (const line of lines.slice(headerIndex + 1)) {
      if (!line.includes('|') || /^\s*\|?\s*:?-{2,}/.test(line)) continue
      const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim())
      if (cells.length < 5 || cells.every(cell => !cell || /^:?-+:?$/.test(cell))) continue
      const legacyResult = cells[4] ?? ''
      const result = /within|pass|ok/i.test(legacyResult) ? 'Within limit' : /outside|fail/i.test(legacyResult) ? 'Outside limit' : legacyResult
      checks.push({ time: cells[0] ?? '', item: cells[1] ?? '', actual: cells[2] ?? '', limit: cells[3] ?? '', result, action: cells[5] ?? '', initials: cells[6] ?? '' })
    }
  }
  const notes = doc.content.match(/## Additional notes\s*\n([\s\S]*?)(?=\n## |$)/i)?.[1]?.trim() ?? ''
  return { ...emptyTemperatureRecord, date: field('Date'), completedBy: field('Person completing checks'), checks: checks.length ? checks : [blankTemperatureCheck()], notes }
}

function temperatureRecordMarkdown(form: TemperatureRecordForm, title = 'Daily Temperature Records') {
  const checks = form.checks.filter(check => Object.values(check).some(value => value.trim()))
  const rows = checks.map(check => `| ${check.time || ''} | ${check.item || ''} | ${check.actual || ''} | ${check.limit || ''} | ${check.result || ''} | ${check.action || ''} | ${check.initials || ''} |`).join('\n')
  return `# ${title}\n\n**Date:** ${form.date || 'To be completed'}  \n**Person completing checks:** ${form.completedBy || 'To be completed'}\n\n| Time | Equipment / food | Actual temperature (°C) | Business limit | Result | Corrective action | Initials |\n| --- | --- | --- | --- | --- | --- | --- |\n${rows}\n\n${form.notes ? `## Additional notes\n${form.notes}\n\n` : ''}Record actual readings at the frequency set in your food safety procedures. Use a suitable, clean thermometer where required. Do not write a guessed reading. If a limit is missed, assess the food, take safe corrective action and record what happened. Set limits using current official guidance and the specific food and process.`
}

function isDailyOpeningClosingDocument(doc: Doc) {
  const title = doc.title.trim().toLowerCase()
  return Boolean(doc.openingClosingData) || doc.id === 'd2' || doc.id === 'fs11' || title === 'daily opening & closing checks' || title === 'opening and closing checklists'
}

function openingClosingFormFromDocument(doc: Doc): OpeningClosingForm {
  if (doc.openingClosingData) return { ...emptyOpeningClosingForm, ...doc.openingClosingData, opening: doc.openingClosingData.opening?.length ? doc.openingClosingData.opening : checklistItems(openingItems), closing: doc.openingClosingData.closing?.length ? doc.openingClosingData.closing : checklistItems(closingItems) }
  const field = (name: string) => doc.content.match(new RegExp(`^(?:\\*\\*)?${name}(?:\\*\\*)?:[ \\t]*(.*)$`, 'im'))?.[1]?.trim() ?? ''
  const section = (name: string, next: string) => doc.content.match(new RegExp(`## ${name}\\s*\\n([\\s\\S]*?)(?=\\n## ${next}\\b|$)`, 'i'))?.[1] ?? ''
  const parseItems = (body: string, fallback: string[]) => {
    const items = Array.from(body.matchAll(/^\s*-\s*\[([ xX])\]\s*(.+?)\s*$/gm), match => ({ label: match[2], status: match[1].toLowerCase() === 'x' ? 'Complete' : 'Not checked', action: '' }))
    return items.length ? items : checklistItems(fallback)
  }
  const issues = doc.content.match(/## Issues and corrective action\s*\n([\s\S]*?)(?=\n## |$)/i)?.[1] ?? ''
  const issue = issues.match(/^Issue:[ \t]*(.*)$/im)?.[1]?.trim() ?? ''
  const action = issues.match(/^Action taken:[ \t]*(.*)$/im)?.[1]?.trim() ?? ''
  const followUp = issues.match(/^Follow-up required:[ \t]*(.*)$/im)?.[1]?.trim() ?? ''
  return { ...emptyOpeningClosingForm, date: field('Date'), responsible: field('Person responsible'), opening: parseItems(section('Opening', 'Closing'), openingItems), closing: parseItems(section('Closing', 'Issues and corrective action'), closingItems), issue, action, followUp }
}

function openingClosingMarkdown(form: OpeningClosingForm) {
  const section = (title: string, items: OpeningClosingItem[]) => `## ${title}\n\n| Check | Status | Notes / action |\n| --- | --- | --- |\n${items.map(item => `| ${item.label || 'Untitled check'} | ${item.status || 'Not checked'} | ${item.action || ''} |`).join('\n')}`
  return `# Daily Opening & Closing Checks\n\n**Date:** ${form.date || 'To be completed'}  \n**Person responsible:** ${form.responsible || 'To be completed'}\n\n${section('Opening', form.opening)}\n\n${section('Closing', form.closing)}\n\n## Issues and corrective action\n\n**Issue:** ${form.issue || 'None recorded'}  \n**Action taken:** ${form.action || 'To be completed if an issue arises'}  \n**Follow-up required:** ${form.followUp || 'None recorded'}`
}

function isCleaningRecordDocument(doc: Doc) {
  return Boolean(doc.cleaningData) || doc.id === 'fs4' || doc.title.trim().toLowerCase() === 'cleaning and disinfection schedule and records'
}
function cleaningRecordFromDocument(doc: Doc): CleaningRecordForm {
  if (doc.cleaningData) return { ...emptyCleaningRecordForm, ...doc.cleaningData, records: doc.cleaningData.records?.length ? doc.cleaningData.records.map(row => ({ ...blankCleaningRecord(), ...row })) : [blankCleaningRecord()] }
  const lines = doc.content.split(/\r?\n/)
  const header = lines.findIndex(line => /area\s*\/\s*item/i.test(line) && /product/i.test(line) && /frequency/i.test(line))
  const records: CleaningRecord[] = []
  if (header >= 0) for (const line of lines.slice(header + 1)) {
    if (!line.includes('|') || /^\s*\|?\s*:?-{2,}/.test(line)) continue
    const c = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(v => v.trim())
    if (c.length < 5 || c.every(v => !v || /^:?-+:?$/.test(v))) continue
    records.push({ area: c[0] || '', product: c[1] || '', method: c[2] || '', frequency: c[3] || '', status: c[4] || 'Not done', completedBy: c[5] || '', checkedBy: c[6] || '', issue: c[7] || '' })
  }
  return { ...emptyCleaningRecordForm, records: records.length ? records : [blankCleaningRecord()] }
}
function cleaningRecordMarkdown(form: CleaningRecordForm) {
  const rows = form.records.filter(row => Object.values(row).some(value => value.trim()))
  return `# Cleaning and Disinfection Schedule and Records\n\n**Date:** ${form.date || 'To be completed'}\n\n| Area / item | Product and dilution (follow label) | Method / contact time | Frequency | Status | Completed by | Checked by | Issue / action |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n${rows.map(r => `| ${r.area} | ${r.product} | ${r.method} | ${r.frequency} | ${r.status} | ${r.completedBy} | ${r.checkedBy} | ${r.issue} |`).join('\n')}\n\n${form.notes ? `## Additional notes\n${form.notes}\n\n` : ''}Include food-contact surfaces, utensils, cooker/fryer, fridge handles and shelves, warmer, sinks, handwashing points, floors, bins, storage and vehicle touchpoints as applicable. Remove visible soil first, then disinfect food-contact surfaces with a suitable product following the label dilution and contact time. Keep chemicals away from food and utensils. Record the real task, any issue and corrective action.`
}
function isPestWasteWaterDocument(doc: Doc) {
  return Boolean(doc.pestWasteWaterData) || doc.id === 'fs10' || /pest control, waste and water safety records/i.test(doc.title)
}
function pestWasteWaterFromDocument(doc: Doc): PestWasteWaterForm {
  if (doc.pestWasteWaterData) return { ...emptyPestWasteWaterForm, ...doc.pestWasteWaterData, records: doc.pestWasteWaterData.records?.length ? doc.pestWasteWaterData.records.map(row => ({ ...blankPestWasteWaterRecord(), ...row })) : [blankPestWasteWaterRecord()] }
  return { ...emptyPestWasteWaterForm }
}
function pestWasteWaterMarkdown(form: PestWasteWaterForm) {
  const records = form.records.filter(row => Object.values(row).some(value => value.trim() && !['Satisfactory', 'Not checked'].includes(value)))
  const clean = (value: string) => value.replaceAll('|', '\\|').replace(/\r?\n/g, ' ')
  return `# Pest Control, Waste and Water Safety Records\n\n| Date | Record type | Location / system | Findings / condition | Status | Action / service details | Water source | Potable water confirmed | Tank cleaning / disinfection / refill | Fresh / wastewater separation | Responsible | Follow-up date | Verified by |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${records.map(row => `| ${[row.date, row.recordType, row.location, row.findings, row.status, row.action, row.waterSource, row.potable, row.tankService, row.separationCheck, row.responsible, row.followUpDate, row.verifiedBy].map(clean).join(' | ')} |`).join('\n')}\n\n${form.notes.trim() ? `## Additional notes\n\n${form.notes.trim()}\n\n` : ''}Record actual inspections, issues, actions, visits and checks. Protect food and food-contact equipment from pests and waste. Use potable water for food handling and handwashing; do not use water of uncertain safety. Keep fresh and wastewater separate and record tank cleaning and disinfection as applicable. Adapt checks to the actual water system and local requirements.`
}
function isTrainingRecordsDocument(doc: Doc) {
  return Boolean(doc.trainingRecordsData) || doc.id === 'fs13' || /food safety training records/i.test(doc.title)
}
function trainingRecordsFromDocument(doc: Doc): TrainingRecordsForm {
  if (doc.trainingRecordsData) return { ...emptyTrainingRecordsForm, ...doc.trainingRecordsData, records: doc.trainingRecordsData.records?.length ? doc.trainingRecordsData.records.map(row => ({ ...blankTrainingRecord(), ...row })) : [blankTrainingRecord()] }
  return { ...emptyTrainingRecordsForm }
}
function trainingRecordsMarkdown(form: TrainingRecordsForm) {
  const rows = form.records.filter(row => Object.values(row).some(value => value.trim() && value !== 'Not recorded'))
  const clean = (value: string) => value.replaceAll('|', '\\\\|').replace(/\\r?\\n/g, ' ')
  return `# Food Safety Training Records\n\n| Staff member | Role | Training / instruction | Status | Date completed | Trainer / provider | Evidence / certificate location | Refresher due | Additional support needed | Signature / acknowledgement |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${rows.map(row => `| ${[row.staffMember, row.role, row.training, row.status, row.dateCompleted, row.trainer, row.evidence, row.refresherDue, row.support, row.acknowledgement].map(clean).join(' | ')} |`).join('\\n')}\n\n${form.notes.trim() ? `## Additional notes\n\n${form.notes.trim()}\n\n` : ''}Assign instruction to the tasks each person performs. Record completion only when the training or briefing has taken place, and keep certificates or other evidence at the location stated. Identify supervision or further support needed and review training when duties, procedures or equipment change. This log is a record of instruction; it does not by itself certify competence.`
}
function isDocumentReviewLog(doc: Doc) {
  return Boolean(doc.documentReviewData) || doc.id === 'fs14' || /document review and update log/i.test(doc.title)
}
function documentReviewFromDocument(doc: Doc): DocumentReviewForm {
  if (doc.documentReviewData) return { ...emptyDocumentReviewForm, ...doc.documentReviewData, records: doc.documentReviewData.records?.length ? doc.documentReviewData.records.map(row => ({ ...blankDocumentReviewRecord(), ...row })) : [blankDocumentReviewRecord()] }
  return { ...emptyDocumentReviewForm }
}
function documentReviewMarkdown(form: DocumentReviewForm) {
  const rows = form.records.filter(row => Object.values(row).some(value => value.trim() && value !== 'Not recorded'))
  const clean = (value: string) => value.replaceAll('|', '\\|').replace(/\r?\n/g, ' ')
  const header = '# Document Review and Update Log\n\n| Document / procedure | Version | Review date | Reason for review | Outcome | Changes made | Reviewed by | Staff briefed (date) | Next review date | Superseded version / location |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'
  const data = rows.map(row => '| ' + [row.document, row.version, row.reviewDate, row.reason, row.outcome, row.changes, row.reviewedBy, row.staffBriefedDate, row.nextReviewDate, row.supersededReference].map(clean).join(' | ') + ' |')
  const notes = form.notes.trim() ? ['## Additional notes', '', form.notes.trim()] : []
  const guidance = 'Review this food safety system after changes to the menu, recipes, suppliers, equipment, premises, water arrangements, staff responsibilities or working methods, and after incidents or relevant guidance changes. Record the review even when no changes are needed. Brief affected staff and identify the current version clearly; mark superseded copies so they are not used by mistake.'
  return [header, ...data, '', ...notes, '', guidance].join('\n')
}
function isSupplierDeliveryDocument(doc: Doc) {
  const title = doc.title.trim().toLowerCase()
  return Boolean(doc.supplierDeliveryData) || doc.id === 'fs6' || title === 'supplier and delivery records'
}
function supplierDeliveryFromDocument(doc: Doc): SupplierDeliveryForm {
  if (doc.supplierDeliveryData) return { ...emptySupplierDeliveryForm, ...doc.supplierDeliveryData, records: doc.supplierDeliveryData.records?.length ? doc.supplierDeliveryData.records.map(row => ({ ...blankSupplierDelivery(), ...row })) : [blankSupplierDelivery()] }
  const lines = doc.content.split(/\r?\n/)
  const headerIndex = lines.findIndex(line => /supplier/i.test(line) && /product/i.test(line) && /accepted/i.test(line))
  const header = headerIndex >= 0 ? lines[headerIndex].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(v => v.trim().toLowerCase()) : []
  const records: SupplierDelivery[] = []
  if (headerIndex >= 0) for (const line of lines.slice(headerIndex + 1)) {
    if (!line.includes('|') || /^\s*\|?\s*:?-{2,}/.test(line)) continue
    const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(v => v.trim())
    if (cells.length < 5 || cells.every(v => !v || /^:?-+:?$/.test(v))) continue
    const at = header.findIndex(v => /date\s*\/\s*time|time/.test(v))
    const value = (pattern: RegExp, fallback: number) => { const index = header.findIndex(v => pattern.test(v)); return cells[index >= 0 ? index : fallback] || '' }
    const dateTime = cells[at >= 0 ? at : 0] || ''
    const time = dateTime.match(/\b\d{1,2}:\d{2}\b/)?.[0] || ''
    records.push({ ...blankSupplierDelivery(), time, supplier: value(/supplier/, 1), product: value(/product/, 2), quantity: '', batchUseBy: value(/batch|use.by|traceab/, 3), condition: value(/packaging|condition/, 4), temperature: value(/temperature|temp/, 5), decision: value(/accepted|decision/, 6) || 'Not checked', issueAction: value(/issue|action/, 7), checkedBy: value(/checked by|initials/, 8) })
  }
  const date = doc.content.match(/^Date\s*:\s*(\d{4}-\d{2}-\d{2})/im)?.[1] || ''
  return { ...emptySupplierDeliveryForm, date, records: records.length ? records : [blankSupplierDelivery()] }
}
function supplierDeliveryMarkdown(form: SupplierDeliveryForm) {
  const rows = form.records.filter(row => Object.values(row).some(value => value.trim() && value !== 'Not checked'))
  const line = (cells: string[]) => `| ${cells.map(cell => cell.replaceAll('|', '\\|').replace(/\r?\n/g, ' ')).join(' | ')} |`
  return `# Supplier and Delivery Records\n\n**Date:** ${form.date || 'To be completed'}\n\n${line(['Time', 'Supplier', 'Product', 'Quantity', 'Batch / use-by / traceability', 'Packaging / condition', 'Temperature (where required)', 'Decision', 'Issue / action', 'Checked by'])}\n${line(Array(10).fill('---'))}\n${rows.map(row => line([row.time, row.supplier, row.product, row.quantity, row.batchUseBy, row.condition, row.temperature, row.decision, row.issueAction, row.checkedBy])).join('\n')}\n\n${form.notes ? `## Additional notes\n${form.notes}\n\n` : ''}Check deliveries against the business's documented acceptance criteria. Record actual observations and any temperature only where required by the product and procedure. Keep invoices and traceability details. Reject or isolate goods that are unsafe, damaged, contaminated or outside the criteria; record the reason, action, supplier contact and follow-up. Do not guess or backdate records.`
}
function isStorageRotationDocument(doc: Doc) {
  const title = doc.title.trim().toLowerCase()
  return Boolean(doc.storageRotationData) || doc.id === 'fs7' || title === 'food storage and stock rotation records'
}
function storageRotationFromDocument(doc: Doc): StorageRotationForm {
  if (doc.storageRotationData) return { ...emptyStorageRotationForm, ...doc.storageRotationData, records: doc.storageRotationData.records?.length ? doc.storageRotationData.records.map(row => ({ ...blankStorageRotationRecord(), ...row })) : [blankStorageRotationRecord()] }
  const lines = doc.content.split(/\r?\n/)
  const headerIndex = lines.findIndex(line => /product/i.test(line) && /batch|use.by/i.test(line) && /storage location/i.test(line))
  const header = headerIndex >= 0 ? lines[headerIndex].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(v => v.trim().toLowerCase()) : []
  const records: StorageRotationRecord[] = []
  if (headerIndex >= 0) for (const line of lines.slice(headerIndex + 1)) {
    if (!line.includes('|') || /^\s*\|?\s*:?-{2,}/.test(line)) continue
    const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(v => v.trim())
    if (cells.length < 4 || cells.every(v => !v || /^:?-+:?$/.test(v))) continue
    const get = (pattern: RegExp, fallback: number) => { const index = header.findIndex(v => pattern.test(v)); return cells[index >= 0 ? index : fallback] || '' }
    records.push({ product: get(/product/, 0), batchUseBy: get(/batch|use.by/, 1), location: get(/storage location|location/, 2), openedPrepared: get(/opened|prepared/, 3), rotation: get(/rotation check|rotation|status/, 4) || 'Not checked', discardAction: get(/discard|action/, 5), initials: get(/initials|checked by/, 6) })
  }
  const date = doc.content.match(/^Date\s*:\s*(\d{4}-\d{2}-\d{2})/im)?.[1] || ''
  return { ...emptyStorageRotationForm, date, records: records.length ? records : [blankStorageRotationRecord()] }
}
function storageRotationMarkdown(form: StorageRotationForm) {
  const rows = form.records.filter(row => Object.values(row).some(value => value.trim() && value !== 'Not checked'))
  const line = (cells: string[]) => `| ${cells.map(cell => cell.replaceAll('|', '\\|').replace(/\r?\n/g, ' ')).join(' | ')} |`
  return `# Food Storage and Stock Rotation Records\n\n**Date:** ${form.date || 'To be completed'}\n\n${line(['Product', 'Batch / use-by date', 'Storage location', 'Date opened / prepared', 'Rotation check', 'Discard date / action', 'Initials'])}\n${line(Array(7).fill('---'))}\n${rows.map(row => line([row.product, row.batchUseBy, row.location, row.openedPrepared, row.rotation, row.discardAction, row.initials])).join('\n')}\n\n${form.notes ? `## Additional notes\n${form.notes}\n\n` : ''}Store food covered, labelled and under the conditions required for the product. Keep raw foods separate from ready-to-eat foods and chemicals separate from food. Follow use-by dates and after-opening instructions, rotate stock so older suitable stock is used first, and discard food when safety cannot be assured. Record real checks and actions; do not guess or backdate.`
}
function isFoodProcessDocument(doc: Doc) {
  return Boolean(doc.foodProcessData) || doc.id === 'fs8' || doc.title.trim().toLowerCase() === 'food preparation, cooking, cooling and reheating procedures'
}
function foodProcessFromDocument(doc: Doc): FoodProcessForm {
  if (doc.foodProcessData) {
    const saved = doc.foodProcessData
    return { ...emptyFoodProcessStepForm, ...saved, preparation: { ...blankFoodProcessStep(), ...saved.preparation }, cooking: { ...emptyFoodProcessStepForm.cooking, ...saved.cooking }, cooling: { ...blankFoodProcessStep(), ...saved.cooling }, reheating: { ...emptyFoodProcessStepForm.reheating, ...saved.reheating } }
  }
  const section = (name: string) => doc.content.match(new RegExp(`## ${name}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, 'i'))?.[1]?.trim() || ''
  const cooking = section('Cooking')
  const handling = section('Cooling and reheating')
  const procedureText = handling.split(/Food-specific limits and methods/i)[0].trim()
  const reheatingAt = procedureText.search(/(?:^|\n)-\s*Reheat/i)
  return {
    ...emptyFoodProcessStepForm,
    preparation: { ...blankFoodProcessStep(), method: section('Preparation') },
    cooking: { ...emptyFoodProcessStepForm.cooking, method: cooking },
    cooling: { ...blankFoodProcessStep(), method: reheatingAt > 0 ? procedureText.slice(0, reheatingAt).trim() : procedureText },
    reheating: { ...emptyFoodProcessStepForm.reheating, method: reheatingAt >= 0 ? procedureText.slice(reheatingAt).trim() : '' },
    notes: doc.content.match(/Food-specific limits and methods[\s\S]*$/i)?.[0]?.trim() || ''
  }
}
function foodProcessMarkdown(form: FoodProcessForm) {
  const field = (label: string, value: string) => `**${label}:** ${value.trim() || 'To be completed for the actual menu and process.'}`
  const section = (title: string, step: FoodProcessStep) => `## ${title}\n\n### Method\n${step.method.trim() || 'Describe the actual product-specific method and equipment.'}\n\n${field('Critical limit / acceptance criteria', step.limit)}\n\n${field('Monitoring and records', step.monitoring)}\n\n${field('Corrective action', step.correctiveAction)}`
  return `# Food Preparation, Cooking, Cooling and Reheating Procedures\n\n**Business:** ${form.business || 'To be completed'}  \n**Responsible person:** ${form.responsible || 'To be confirmed'}  \n**Review date:** ${form.reviewDate || 'To be set'}\n\n${section('Preparation', form.preparation)}\n\n${section('Cooking', form.cooking)}\n\n${section('Cooling', form.cooling)}\n\n${section('Reheating', form.reheating)}\n\n${form.notes ? `## Additional notes\n${form.notes}\n\n` : ''}Use clean hands, utensils and equipment; keep raw and ready-to-eat foods separate and avoid cross-contamination. Apply methods and limits that match the actual food, equipment and process. Use a cleaned and disinfected probe where required and record real checks and corrective actions. Review this procedure when recipes, suppliers, equipment or working methods change.`
}
function isHygienePolicyDocument(doc: Doc) {
  return Boolean(doc.hygienePolicyData) || doc.id === 'fs9' || /personal hygiene and staff illness policy/i.test(doc.title)
}
function hygienePolicyFromDocument(doc: Doc): HygienePolicyForm {
  if (doc.hygienePolicyData) return { ...emptyHygienePolicyForm, ...doc.hygienePolicyData }
  const personal = doc.content.match(/## Personal hygiene\s*\n([\s\S]*?)(?=\n## |$)/i)?.[1] || ''
  const illness = (doc.content.match(/## Illness reporting\s*\n([\s\S]*?)(?=\n## |$)/i)?.[1] || '').split(/\nPerson responsible for decisions:/i)[0].trim()
  const lines = personal.split(/\r?\n/).map(line => line.replace(/^\s*[-*]\s*/, '').trim()).filter(Boolean)
  const pick = (pattern: RegExp) => lines.find(line => pattern.test(line))
  return { ...emptyHygienePolicyForm, handwashing: pick(/wash hands/i) || emptyHygienePolicyForm.handwashing, clothing: pick(/work clothing|hair/i) || emptyHygienePolicyForm.clothing, wounds: pick(/cuts|wound/i) || emptyHygienePolicyForm.wounds, hygiene: lines.filter(line => !/wash hands|work clothing|hair|cuts|wound/i.test(line)).join('\n') || emptyHygienePolicyForm.hygiene, symptoms: illness.trim() || emptyHygienePolicyForm.symptoms, responsible: doc.content.match(/^Person responsible for decisions:[ \t]*([^\r\n]*)/im)?.[1]?.trim() || '', records: doc.content.match(/^Staff briefing\s*\/\s*acknowledgement records:[ \t]*([^\r\n]*)/im)?.[1]?.trim() || emptyHygienePolicyForm.records }
}
function hygienePolicyMarkdown(form: HygienePolicyForm) {
  const field = (label: string, value: string) => `**${label}:** ${value.trim() || 'To be completed.'}`
  const section = (title: string, value: string, fallback: string) => `## ${title}\n\n${value.trim() || fallback}`
  return `# Personal Hygiene and Staff Illness Policy\n\n**Business:** ${form.business || 'To be completed'}  \n**Person responsible:** ${form.responsible || 'To be confirmed'}  \n**Review date:** ${form.reviewDate || 'To be set'}\n\n${section('Handwashing', form.handwashing, emptyHygienePolicyForm.handwashing)}\n\n${section('Work clothing and personal hygiene', `${form.clothing.trim()}\n\n${form.hygiene.trim()}`, emptyHygienePolicyForm.clothing)}\n\n${section('Cuts, wounds and skin infections', form.wounds, emptyHygienePolicyForm.wounds)}\n\n${section('Illness and symptom reporting', form.symptoms, emptyHygienePolicyForm.symptoms)}\n\n${field('How to report', form.reportingRoute)}\n\n${section('Exclusion and food handling', form.exclusion, emptyHygienePolicyForm.exclusion)}\n\n${section('Return to work', form.returnToWork, emptyHygienePolicyForm.returnToWork)}\n\n${section('Fitness-to-work assessment and decision record', form.assessment, emptyHygienePolicyForm.assessment)}\n\n${section('Staff briefing and training', form.training, emptyHygienePolicyForm.training)}\n\n${section('Records and confidentiality', form.records, emptyHygienePolicyForm.records)}\n\n${form.notes.trim() ? `## Additional notes\n\n${form.notes.trim()}\n\n` : ''}Use current Food Standards Agency and local authority guidance. This starter policy must be reviewed against the actual operation and any illness-specific advice; it is not medical advice or a completed compliance record.`
}
function isManagementPackDocument(doc: Doc) {
  return Boolean(doc.managementPackData) || doc.id === 'd1' || doc.title.trim().toLowerCase() === 'food safety management pack'
}
function managementPackFormFromDocument(doc: Doc): ManagementPackForm {
  if (doc.managementPackData) return { ...emptyManagementPackForm, ...doc.managementPackData }
  const business = doc.content.match(/^Business:\s*(.*)$/im)?.[1]?.trim() || emptyManagementPackForm.business
  const purpose = doc.content.match(/## Purpose\s*\n([\s\S]*?)(?=\n## |$)/i)?.[1]?.trim() || ''
  const beforeUse = doc.content.match(/## Before use\s*\n([\s\S]*?)(?=\n## |$)/i)?.[1]?.trim() || ''
  return { ...emptyManagementPackForm, business, operation: purpose, notes: beforeUse }
}
function managementPackMarkdown(form: ManagementPackForm) {
  const section = (heading: string, value: string) => `## ${heading}\n${value.trim() || 'To be completed for the actual business.'}`
  return `# Food Safety Management Pack\n\n**Business:** ${form.business || 'To be completed'}  \n**Food safety lead:** ${form.responsible || 'To be confirmed'}  \n**Deputy / cover:** ${form.deputy || 'To be confirmed'}  \n**Review frequency:** ${form.reviewFrequency}  \n**Next review date:** ${form.reviewDate || 'Set a review date'}\n\n${section('Business and food operation', form.operation)}\n\n${section('Menu and food handled', form.menu)}\n\n${section('Preparation and process controls', form.preparation)}\n\n${section('Cross-contamination prevention', form.crossContamination)}\n\n${section('Temperature control', form.temperature)}\n\n${section('Cleaning and disinfection', form.cleaning)}\n\n${section('Allergen management', form.allergens)}\n\n${section('Deliveries and suppliers', form.deliveries)}\n\n${section('Food storage and stock rotation', form.storage)}\n\n${section('Personal hygiene and illness reporting', form.illness)}\n\n${section('Corrective action and incidents', form.correctiveActions)}\n\n${section('Training and supervision', form.training)}\n\n${section('Supporting records and where kept', form.records)}\n\n${form.notes ? `## Additional notes\n${form.notes}\n\n` : ''}This is a working starter pack, not a completed or approved food safety system. Adapt it to the actual menu, premises, equipment, processes and current Food Standards Agency guidance. Record real checks and actions; do not guess or backdate records.`
}
function isAllergenMatrixDocument(doc: Doc) {
  const title = doc.title.trim().toLowerCase()
  return Boolean(doc.allergenMatrixData) || doc.id === 'd4' || title === 'allergen matrix — menu' || title === 'allergen matrix - menu'
}
function allergenMatrixFromDocument(doc: Doc): AllergenMatrixForm {
  if (doc.allergenMatrixData) return { ...emptyAllergenMatrix, ...doc.allergenMatrixData, items: doc.allergenMatrixData.items?.length ? doc.allergenMatrixData.items.map(item => ({ ...blankAllergenMenuItem(), ...item, allergens: item.allergens || [] })) : [blankAllergenMenuItem()] }
  const lines = doc.content.split(/\r?\n/)
  const headerIndex = lines.findIndex(line => /menu item/i.test(line) && /allergen|cereals containing gluten/i.test(line))
  const headerCells = headerIndex >= 0 ? lines[headerIndex].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(v => v.trim()) : []
  const items: AllergenMenuItem[] = []
  if (headerIndex >= 0) for (const line of lines.slice(headerIndex + 1)) {
    if (!line.includes('|') || /^\s*\|?\s*:?-{2,}/.test(line)) continue
    const c = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(v => v.trim())
    if (c.length < 5 || c.every(v => !v || /^:?-+:?$/.test(v)) || (/menu item/i.test(c[0] || '') && /ingredient/i.test(c[1] || ''))) continue
    const wideMatrix = headerCells.length >= 12
    const selected = wideMatrix
      ? regulatedAllergens.filter((allergen, index) => /^(?:yes|present|x|✓|✔)$/i.test(c[index + 2] || ''))
      : regulatedAllergens.filter(a => (c[2] || '').split(/[,;]/).some(v => v.trim().toLowerCase() === a.toLowerCase()))
    const crossIndex = wideMatrix ? headerCells.findIndex(v => /cross.contact/i.test(v)) : 3
    const verifyIndex = wideMatrix ? headerCells.findIndex(v => /checked by|verified by/i.test(v)) : 4
    const verifyText = c[verifyIndex] || ''
    const verifiedDate = /checked by\s*\//i.test(headerCells[verifyIndex] || '') ? (verifyText.match(/(?:\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/)?.[0] || '') : c[verifyIndex + 1] || ''
    items.push({ name: c[0] || '', ingredients: c[1] || '', allergens: selected, crossContact: c[crossIndex] || '', verifiedBy: verifyText.replace(/\s*(?:\/|,)?\s*(?:\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})$/, ''), verifiedDate })
  }
  return { ...emptyAllergenMatrix, items: items.length ? items : [blankAllergenMenuItem()] }
}
function allergenMatrixMarkdown(form: AllergenMatrixForm) {
  const rows = form.items.filter(item => item.name.trim() || item.ingredients.trim() || item.allergens.length || item.crossContact.trim() || item.verifiedBy.trim() || item.verifiedDate.trim())
  const header = ['Menu item', 'Ingredients / source checked', ...regulatedAllergens, 'Cross-contact controls', 'Verified by', 'Date verified']
  const markdownRows = rows.map(item => [item.name, item.ingredients, ...regulatedAllergens.map(allergen => item.allergens.includes(allergen) ? 'Yes' : ''), item.crossContact, item.verifiedBy, item.verifiedDate])
  const line = (cells: string[]) => `| ${cells.map(cell => cell.replaceAll('|', '\\|').replace(/\r?\n/g, ' ')).join(' | ')} |`
  return `# Allergen Matrix — Menu\n\n**Business:** ${form.business || 'To be completed'}  \n**Last reviewed:** ${form.lastReviewed || 'To be confirmed'}\n\n${line(header)}\n${line(header.map(() => '---'))}\n${markdownRows.map(line).join('\n')}\n\n${form.notes ? `## Additional notes\n${form.notes}\n\n` : ''}Verify each recipe and every current supplier label, including substitutions and relevant processing aids. Mark only allergens confirmed as present in the dish. Record cross-contact controls separately; do not claim a dish is allergen-free unless this has been assessed and can be assured. Update this matrix whenever ingredients, suppliers, recipes or preparation methods change. This matrix supports, but does not replace, accurate customer information and staff checks.`
}
function isAllergenManagementDocument(doc: Doc) {
  const title = doc.title.trim().toLowerCase()
  return Boolean(doc.allergenManagementData) || doc.id === 'fs5' || title === 'allergen management policy and allergen matrix'
}
function allergenManagementFromDocument(doc: Doc): AllergenManagementForm {
  if (doc.allergenManagementData) return { ...emptyAllergenManagement, ...doc.allergenManagementData, matrix: { ...emptyAllergenMatrix, ...doc.allergenManagementData.matrix, items: doc.allergenManagementData.matrix?.items?.length ? doc.allergenManagementData.matrix.items.map(item => ({ ...blankAllergenMenuItem(), ...item, allergens: item.allergens || [] })) : [blankAllergenMenuItem()] } }
  const field = (name: string) => doc.content.match(new RegExp(`^(?:\\*\\*)?${name}(?:\\*\\*)?:[ \\t]*(.*)$`, 'im'))?.[1]?.trim() || ''
  const policy = doc.content.match(/## Policy\s*\n([\s\S]*?)(?=\n## |$)/i)?.[1]?.trim() || ''
  const matrix = allergenMatrixFromDocument(doc)
  return { ...emptyAllergenManagement, business: field('Business') || emptyAllergenManagement.business, responsible: field('Responsible person'), lastReviewed: field('Last verified'), matrix: { ...matrix, business: field('Business') || matrix.business, lastReviewed: field('Last verified') || matrix.lastReviewed }, notes: policy ? `Existing policy text to review and incorporate:\n${policy}` : '' }
}
function allergenManagementMarkdown(form: AllergenManagementForm) {
  const section = (heading: string, body: string) => `## ${heading}\n${body.trim() || 'To be completed for this business.'}`
  const matrix = allergenMatrixMarkdown(form.matrix)
  const tableStart = matrix.indexOf('| Menu item |')
  const tableEnd = matrix.indexOf('\n\n', tableStart)
  const table = tableStart >= 0 ? matrix.slice(tableStart, tableEnd >= 0 ? tableEnd : undefined) : ''
  return `# Allergen Management Policy and Allergen Matrix\n\n**Business:** ${form.business || 'To be completed'}  \n**Responsible person:** ${form.responsible || 'To be confirmed'}  \n**Last reviewed:** ${form.lastReviewed || 'To be confirmed'}\n\n${section('Policy and responsibilities', `The business will provide accurate allergen information and manage allergen risks in food preparation. The responsible person maintains recipes and supplier information, checks the matrix, briefs staff and reviews changes.\n\nResponsible person: ${form.responsible || 'To be confirmed'}`)}\n\n${section('Ingredient and supplier checks', form.ingredientChecks)}\n\n${section('Recipe changes and substitutions', form.recipeChanges)}\n\n${section('Cross-contact prevention', form.crossContact)}\n\n${section('Customer information and escalation', form.customerInformation)}\n\n${section('Staff training and communication', form.staffTraining)}\n\n${section('Prepacked for direct sale (PPDS)', form.ppds)}\n\n## Menu allergen matrix\n\n${table}\n\n${form.notes ? `## Additional notes\n${form.notes}\n\n` : ''}Review the matrix whenever ingredients, supplier, recipe or preparation methods change. Verify menu information against current labels and recipes; staff should be able to locate and explain current written information. This document is a starter template and must reflect actual business practice.`
}

export default function App() {
  const [activeBusiness, setActiveBusiness] = useState('kitchen')
  const [page, setPage] = useState('overview')
  const [docs, setDocs] = useState<Doc[]>(() => { try { const v = localStorage.getItem('bh-docs-v1'); return normalizeFoodHandlingCategories(migratePolicyDocumentDocs(v ? JSON.parse(v) : initialDocs)) } catch { return normalizeFoodHandlingCategories(initialDocs) } })
  const [safety, setSafety] = useState<SafetyItem[]>(() => { try { const v = localStorage.getItem('bh-safety-v1'); return v ? JSON.parse(v) : safetyInitial } catch { return safetyInitial } })
  useEffect(() => { setDocs(old => { const ids = new Set(old.map(d => d.id)); const additions = initialDocs.filter(d => d.id.startsWith('fs') && !ids.has(d.id)); return normalizeFoodHandlingCategories(additions.length ? [...old, ...additions] : old) }) }, [])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Doc | null>(null)
  const [editorTitle, setEditorTitle] = useState('')
  const [editorContent, setEditorContent] = useState('')
  const [overviewForm, setOverviewForm] = useState<OverviewForm>(emptyOverviewForm)
  const [policyForm, setPolicyForm] = useState<PolicyForm>(emptyPolicyForm)
  const [temperatureForm, setTemperatureForm] = useState<TemperatureRecordForm>(emptyTemperatureRecord)
  const [temperatureMonitoringForm, setTemperatureMonitoringForm] = useState<TemperatureRecordForm>(emptyTemperatureRecord)
  const [openingClosingForm, setOpeningClosingForm] = useState<OpeningClosingForm>(emptyOpeningClosingForm)
  const [cleaningForm, setCleaningForm] = useState<CleaningRecordForm>(emptyCleaningRecordForm)
  const [supplierDeliveryForm, setSupplierDeliveryForm] = useState<SupplierDeliveryForm>(emptySupplierDeliveryForm)
  const [storageRotationForm, setStorageRotationForm] = useState<StorageRotationForm>(emptyStorageRotationForm)
  const [foodProcessForm, setFoodProcessForm] = useState<FoodProcessForm>(emptyFoodProcessStepForm)
  const [hygienePolicyForm, setHygienePolicyForm] = useState<HygienePolicyForm>(emptyHygienePolicyForm)
  const [managementPackForm, setManagementPackForm] = useState<ManagementPackForm>(emptyManagementPackForm)
  const [allergenMatrixForm, setAllergenMatrixForm] = useState<AllergenMatrixForm>(emptyAllergenMatrix)
  const [allergenManagementForm, setAllergenManagementForm] = useState<AllergenManagementForm>(emptyAllergenManagement)
  const [pestWasteWaterForm, setPestWasteWaterForm] = useState<PestWasteWaterForm>(emptyPestWasteWaterForm)
  const [trainingRecordsForm, setTrainingRecordsForm] = useState<TrainingRecordsForm>(emptyTrainingRecordsForm)
  const [documentReviewForm, setDocumentReviewForm] = useState<DocumentReviewForm>(emptyDocumentReviewForm)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('General')
  const [toast, setToast] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const active = businesses.find(b => b.id === activeBusiness) ?? businesses[0]
  const businessDocs = useMemo(() => {
    const selected = docs.filter(d => d.businessId === activeBusiness)
    if (activeBusiness !== 'kitchen') return selected
    const importance = [
      'Food Safety Management Pack',
      'Food safety management overview',
      'Food safety policy and responsibilities',
      'Food preparation, cooking, cooling and reheating procedures',
      'Allergen management policy and allergen matrix',
      'Allergen Matrix — Menu',
      'Personal hygiene and staff illness policy',
      'Daily Opening & Closing Checks',
      'Opening and closing checklists',
      'Temperature Monitoring Log',
      'Daily temperature records',
      'Supplier and delivery records',
      'Food storage and stock rotation records',
      'Cleaning and disinfection schedule and records',
      'Pest control, waste and water safety records',
      'Corrective actions and incident records',
      'Food safety training records',
      'Document review and update log',
    ]
    const rank = (doc: Doc) => {
      const index = importance.findIndex(title => title.toLowerCase() === doc.title.trim().toLowerCase())
      return index < 0 ? importance.length : index
    }
    return selected.map((doc, index) => ({ doc, index })).sort((a, b) => rank(a.doc) - rank(b.doc) || a.index - b.index).map(item => item.doc)
  }, [docs, activeBusiness])
  const filteredDocs = useMemo(() => businessDocs.filter(d => `${d.title} ${d.category} ${d.content}`.toLowerCase().includes(search.toLowerCase())), [businessDocs, search])
  const foodSafetyFolderDocs = businessDocs.filter(d => d.category === 'Folder 1 — Food Safety Management')
  const foodHandlingDocs = businessDocs.filter(d => d.category === foodHandlingCategory)
  const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine
  const [online, setOnline] = useState(isOnline)
  useEffect(() => { try { localStorage.setItem('bh-docs-v1', JSON.stringify(docs)) } catch { setToast('Local storage is full. Export documents to avoid losing changes.') } }, [docs])
  useEffect(() => { try { localStorage.setItem('bh-safety-v1', JSON.stringify(safety)) } catch { /* surfaced when editing documents */ } }, [safety])
  useEffect(() => { const on = () => setOnline(true); const off = () => setOnline(false); window.addEventListener('online', on); window.addEventListener('offline', off); return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) } }, [])
  useEffect(() => { if (!toast) return; const id = window.setTimeout(() => setToast(''), 3500); return () => window.clearTimeout(id) }, [toast])

  function openEditor(doc: Doc) {
    setEditing(doc); setEditorTitle(doc.title); setEditorContent(doc.content);
    if (doc.id === 'fs1' || /food safety management overview/i.test(doc.title.trim())) setOverviewForm(emptyOverviewForm);
    if (isPolicyDocument(doc)) setPolicyForm(policyFormFromDocument(doc));
    if (isDailyTemperatureDocument(doc)) setTemperatureForm(temperatureRecordFromDocument(doc));
    if (isTemperatureMonitoringLog(doc)) setTemperatureMonitoringForm(temperatureMonitoringFormFromDocument(doc));
    if (isDailyOpeningClosingDocument(doc)) setOpeningClosingForm(openingClosingFormFromDocument(doc));
    if (isCleaningRecordDocument(doc)) setCleaningForm(cleaningRecordFromDocument(doc));
    if (isSupplierDeliveryDocument(doc)) setSupplierDeliveryForm(supplierDeliveryFromDocument(doc));
    if (isStorageRotationDocument(doc)) setStorageRotationForm(storageRotationFromDocument(doc));
    if (isFoodProcessDocument(doc)) setFoodProcessForm(foodProcessFromDocument(doc));
    if (isHygienePolicyDocument(doc)) setHygienePolicyForm(hygienePolicyFromDocument(doc));
    if (isManagementPackDocument(doc)) setManagementPackForm(managementPackFormFromDocument(doc));
    if (isAllergenMatrixDocument(doc)) setAllergenMatrixForm(allergenMatrixFromDocument(doc));
    if (isAllergenManagementDocument(doc)) setAllergenManagementForm(allergenManagementFromDocument(doc));
    if (isPestWasteWaterDocument(doc)) setPestWasteWaterForm(pestWasteWaterFromDocument(doc));
    if (isTrainingRecordsDocument(doc)) setTrainingRecordsForm(trainingRecordsFromDocument(doc));
    if (isDocumentReviewLog(doc)) setDocumentReviewForm(documentReviewFromDocument(doc));
    setPage('documents');
  }
  function overviewMarkdown() {
    const f = overviewForm;
    return `# Food Safety Management Overview

**Business:** ${f.businessName || 'To be confirmed'}
**Responsible person:** ${f.responsiblePerson || 'To be completed'}
**Business / correspondence address:** ${f.businessAddress || 'To be completed'}
**Contact telephone:** ${f.contactPhone || 'To be completed'}
**Contact email:** ${f.contactEmail || 'To be completed'}
**Intended trading location:** ${f.tradingLocation || 'To be confirmed with the relevant landowner/council'}
**Food preparation location:** ${f.preparationLocation}
**Food type / menu summary:** ${f.foodTypes || 'To be completed from the actual menu'}
**Service style:** ${f.serviceStyle}
**Staffing:** ${f.staffCount}
**Water supply:** ${f.waterSupply}
**Wastewater arrangements:** ${f.wastewater}
**Refrigeration:** ${f.refrigeration}
**Hot holding:** ${f.hotHolding}
**Food hygiene training:** ${f.trainingStatus}
**Review date:** ${f.reviewDate || 'Set a review date'}
**Additional notes:** ${f.notes || 'None entered'}

## Purpose and scope
This overview describes the food safety management arrangements for The Small Kitchen mobile food business. Keep it with supporting procedures and completed records and show it to an authorised officer on request.

## How this system is used
- Follow written procedures for the actual menu, equipment, premises and working methods.
- Complete monitoring records at the time checks are made. Record real readings and actions; never guess or backdate records.
- Review the system whenever the menu, ingredients, suppliers, equipment, preparation location, trading location or working practices change, and after an incident or inspection finding.
- Keep supplier invoices, ingredient labels, allergen information, training records, cleaning schedules, temperature logs and corrective-action records together.
- Ensure anyone handling food understands their responsibilities and receives appropriate supervision and training.

## Daily food safety controls
- Check that work areas, handwashing facilities, utensils and food-contact surfaces are clean before starting.
- Confirm potable water and suitable wastewater arrangements are available; stop food preparation if safe water or handwashing cannot be maintained.
- Check refrigeration and frozen storage where used, and record actual temperatures at the frequency set in the relevant procedure.
- Separate raw food from ready-to-eat food and use suitable storage, utensils and cleaning controls to prevent cross-contamination.
- Cook, cool, reheat and hot-hold food using safe, documented methods appropriate to each product. Verify temperatures where required by the procedure.
- Keep current ingredient and allergen information available. Check supplier labels and recipes; never guess or make unsupported allergen-free claims.
- Clean first and disinfect food-contact surfaces using a suitable product according to its label, including the required contact time.
- Protect food during storage and transport, use date labels where appropriate, follow use-by dates and discard food when safety cannot be assured.
- Record problems and corrective actions, including who checked the action and whether follow-up is needed.

## Supporting documents to maintain
Food safety policy and responsibilities; cleaning and disinfection schedule; temperature monitoring logs; allergen matrix; supplier and delivery records; food storage and stock rotation records; food preparation/cooking/cooling/reheating procedures; personal hygiene and illness policy; pest, waste and water records; staff training records; equipment maintenance and relevant safety certificates.

## Important completion notes
This is a working template, not a completed or approved food safety system. Confirm entries against the actual operation. Check current Food Standards Agency guidance and the requirements of Nottingham City Council or the relevant local authority. Do not state that a location, process, training course or permission is approved unless confirmed. Review and sign off this overview before relying on it.`;
  }
  function policyMarkdown() {
    const f = policyForm;
    return `# Food Safety Policy and Responsibilities

**Business:** ${f.businessName || 'To be confirmed'}
**Food safety lead:** ${[f.foodSafetyLead, f.foodSafetyLeadName].filter(Boolean).join(' — ') || 'To be completed'}
**Deputy / cover:** ${f.deputy || 'To be completed if applicable'}
**Business / correspondence address:** ${f.businessAddress || 'To be completed'}
**Intended trading location:** ${f.tradingLocation || 'To be confirmed'}
**Effective date:** ${f.effectiveDate || 'Set before issue'}
**Review date:** ${f.reviewDate || 'Set a review date'}
**Approved / signed by:** ${f.signedBy || 'To be completed'}
**Staffing arrangement:** ${f.staffRoles}
**Additional notes:** ${f.notes || 'None entered'}

## 1. Food safety policy
${f.businessName || 'The business'} is committed to preparing, storing, transporting and serving food in a way that protects customers' health. The business will follow applicable food hygiene requirements, use safe working methods, provide accurate allergen information, maintain clean premises and equipment, and keep truthful, up-to-date records.

## 2. Responsibilities
**Owner / manager:** ${f.ownerResponsibilities}
**Food handlers:** ${f.handlerResponsibilities}
**Training and supervision:** ${f.training}
**Cleaning and disinfection:** ${f.cleaningResponsibilities}
**Allergen management:** ${f.allergenControl}
**Cross-contamination prevention:** ${f.crossContamination}
**Temperature control:** ${f.temperatureControl}
**Record keeping:** ${f.recordKeeping}
**Corrective actions and reporting problems:** ${f.correctiveActions}
**Review frequency:** ${f.reviewFrequency}

Food safety takes priority over speed of service or avoiding waste. If food safety cannot be assured, the affected food or activity must be stopped until the problem is assessed and corrected. Food must not be sold if it may be unsafe or its allergen information cannot be verified.

## 2. Responsibilities

### Food business operator / owner
The owner is responsible for ensuring that:
- Food safety procedures are suitable for the actual menu, equipment, preparation arrangements, transport and trading setup.
- Relevant food business registration and trading permissions are checked and kept up to date.
- Staff receive suitable instruction, training and supervision for their duties.
- Cleaning, temperature, delivery, stock rotation, allergen and other required records are completed and reviewed.
- Equipment, handwashing facilities, potable water and wastewater arrangements are suitable and maintained.
- Problems, complaints, incidents and inspection findings are recorded, investigated and followed up.
- Supplier details, invoices, product labels and current ingredient/allergen information are retained and accessible.
- Procedures are reviewed when anything significant changes and at the review interval recorded above.

### Deputy / person in charge when the owner is absent
The named deputy, if appointed, must understand the relevant procedures, know where records and emergency contacts are kept, complete or check assigned monitoring, and contact the owner about concerns. The deputy must not approve a process or make an allergen claim unless they have reliable information to support it.

### Food handlers / workers
Anyone handling food must:
- Follow the current procedures and instructions for their task.
- Wash hands properly at the required times and maintain good personal hygiene.
- Keep raw food separate from ready-to-eat food and use designated equipment or effective cleaning between tasks.
- Follow cooking, cooling, reheating, hot-holding, refrigeration and date-labelling procedures that apply to the food being handled.
- Check deliveries and report damaged packaging, temperature concerns, contamination or products that do not match the order.
- Use cleaning chemicals as directed and keep them away from food.
- Check ingredient and allergen information before giving customers an answer.
- Report illness, symptoms, injuries, damaged equipment or any unsafe condition immediately.
- Complete assigned records honestly, at the time checks are performed; never guess, copy readings without checking or backdate a record.

## 3. Illness, wounds and fitness to handle food
${f.illnessReporting}. Anyone with symptoms that could contaminate food must tell the person in charge before starting work and follow the business's illness procedure and current official guidance. Cover suitable minor cuts with a waterproof, brightly coloured dressing and use a glove where the procedure requires it. If there is doubt about fitness to handle food, stop food handling and seek appropriate advice.

## 4. Training and supervision
${f.training}. Training should match each person's duties and be refreshed when procedures change or a gap is identified. Keep certificates, induction notes and supervision records where applicable. A certificate alone does not replace day-to-day supervision and safe practice.

## 5. Allergen management
${f.allergenControl}. Maintain an up-to-date allergen matrix based on actual recipes and supplier labels. Check ingredient changes and substitutions before service. Prevent cross-contact through suitable storage, clean equipment and utensils, handwashing and clear communication. If the information cannot be verified, do not guess; explain that the business cannot confirm the item is suitable and do not serve it as allergen-safe.

## 6. Records and corrective action
${f.recordKeeping}. If a check is outside the procedure's acceptable limit or a problem is found, protect customers first: isolate or discard affected food where necessary, stop the unsafe activity, correct the cause where possible, notify the person in charge and record what happened and what action was taken. Escalate unresolved problems and do not resume until safety can be assured.

## 7. Review and approval
${f.reviewFrequency}. The food safety lead should record the outcome of each review, update affected procedures and explain changes to relevant workers. Keep the current version available to staff and authorised officers.

**Signature:** ${f.signedBy || 'To be completed'}
**Date signed:** ${f.effectiveDate || 'To be completed'}

## Important note
This is a practical starter policy and must be adapted to the real operation. It does not itself confirm legal compliance, council approval, training completion or permission to trade. Check current Food Standards Agency guidance and the requirements of the relevant local authority.

## Business-specific policy notes
${policyForm.policyNotes || "To be completed"}

## Responsibilities and assigned shifts
${policyForm.shiftResponsibilities || "To be completed"}

## Illness reporting and action
${policyForm.illnessNotes || "Follow the illness reporting procedure; details to be completed"}

## Records and reporting
${policyForm.recordNotes || "Record checks, problems and corrective actions; assigned person to be confirmed"}
`;
  }
  function saveEditor() {
    if (!editing) return
    const edited = { ...editing, title: editorTitle.trim() || editing.title }
    const isPolicy = isPolicyDocument(edited)
    const isTemperatureRecord = isDailyTemperatureDocument(edited)
    const isTemperatureMonitoring = isTemperatureMonitoringLog(edited)
    const isOpeningClosing = isDailyOpeningClosingDocument(edited)
    const isCleaning = isCleaningRecordDocument(edited)
    const isSupplierDelivery = isSupplierDeliveryDocument(edited)
    const isStorageRotation = isStorageRotationDocument(edited)
    const isFoodProcess = isFoodProcessDocument(edited)
    const isHygienePolicy = isHygienePolicyDocument(edited)
    const isManagementPack = isManagementPackDocument(edited)
    const isAllergenMatrix = isAllergenMatrixDocument(edited)
    const isAllergenManagement = isAllergenManagementDocument(edited)
    const isPestWasteWater = isPestWasteWaterDocument(edited)
    const isTrainingRecords = isTrainingRecordsDocument(edited)
    const isDocumentReview = isDocumentReviewLog(edited)
    const contentToSave = (editing.id === 'fs1' || /food safety management overview/i.test(editorTitle.trim())) ? overviewMarkdown() : isPolicy ? policyMarkdown() : isTemperatureRecord ? temperatureRecordMarkdown(temperatureForm) : isTemperatureMonitoring ? temperatureRecordMarkdown(temperatureMonitoringForm, 'Temperature Monitoring Log') : isOpeningClosing ? openingClosingMarkdown(openingClosingForm) : isCleaning ? cleaningRecordMarkdown(cleaningForm) : isSupplierDelivery ? supplierDeliveryMarkdown(supplierDeliveryForm) : isStorageRotation ? storageRotationMarkdown(storageRotationForm) : isFoodProcess ? foodProcessMarkdown(foodProcessForm) : isHygienePolicy ? hygienePolicyMarkdown(hygienePolicyForm) : isManagementPack ? managementPackMarkdown(managementPackForm) : isAllergenManagement ? allergenManagementMarkdown(allergenManagementForm) : isAllergenMatrix ? allergenMatrixMarkdown(allergenMatrixForm) : isPestWasteWater ? pestWasteWaterMarkdown(pestWasteWaterForm) : isTrainingRecords ? trainingRecordsMarkdown(trainingRecordsForm) : isDocumentReview ? documentReviewMarkdown(documentReviewForm) : editorContent;
    setDocs(old => old.map(d => d.id === editing.id ? { ...d, title: editorTitle.trim() || 'Untitled document', content: contentToSave, ...(isPolicy ? { policyData: { ...policyForm } } : {}), ...(isTemperatureRecord ? { temperatureData: { ...temperatureForm } } : {}), ...(isTemperatureMonitoring ? { temperatureMonitoringData: { ...temperatureMonitoringForm, checks: temperatureMonitoringForm.checks.map(check => ({ ...check })) } } : {}), ...(isOpeningClosing ? { openingClosingData: { ...openingClosingForm } } : {}), ...(isCleaning ? { cleaningData: { ...cleaningForm, records: cleaningForm.records.map(row => ({ ...row })) } } : {}), ...(isSupplierDelivery ? { supplierDeliveryData: { ...supplierDeliveryForm, records: supplierDeliveryForm.records.map(row => ({ ...row })) } } : {}), ...(isStorageRotation ? { storageRotationData: { ...storageRotationForm, records: storageRotationForm.records.map(row => ({ ...row })) } } : {}), ...(isFoodProcess ? { foodProcessData: { ...foodProcessForm, preparation: { ...foodProcessForm.preparation }, cooking: { ...foodProcessForm.cooking }, cooling: { ...foodProcessForm.cooling }, reheating: { ...foodProcessForm.reheating } } } : {}), ...(isHygienePolicy ? { hygienePolicyData: { ...hygienePolicyForm } } : {}), ...(isManagementPack ? { managementPackData: { ...managementPackForm } } : {}), ...(isAllergenManagement ? { allergenManagementData: { ...allergenManagementForm, matrix: { ...allergenManagementForm.matrix, items: allergenManagementForm.matrix.items.map(item => ({ ...item, allergens: [...item.allergens] })) } } } : {}), ...(isAllergenMatrix ? { allergenMatrixData: { ...allergenMatrixForm, items: allergenMatrixForm.items.map(item => ({ ...item, allergens: [...item.allergens] })) } } : {}), ...(isPestWasteWater ? { pestWasteWaterData: { ...pestWasteWaterForm, records: pestWasteWaterForm.records.map(record => ({ ...record })) } } : {}), ...(isTrainingRecords ? { trainingRecordsData: { ...trainingRecordsForm, records: trainingRecordsForm.records.map(record => ({ ...record })) } } : {}), ...(isDocumentReview ? { documentReviewData: { ...documentReviewForm, records: documentReviewForm.records.map(record => ({ ...record })) } } : {}), updatedAt: new Date().toISOString() } : d))
    setEditing(null); setToast('Document saved on this device')
  }
  function createDoc() {
    if (!newTitle.trim()) return
    const doc: Doc = { id: crypto.randomUUID(), businessId: activeBusiness, title: newTitle.trim(), category: newCategory, content: `# ${newTitle.trim()}\n\nStart writing here...`, updatedAt: new Date().toISOString(), type: 'document' }
    setDocs(old => [doc, ...old]); setNewTitle(''); setNewCategory('General'); setShowNew(false); openEditor(doc)
  }
  function exportDoc(doc: Doc) {
    let blob: Blob; let filename = doc.title
    if (doc.type === 'file' && doc.fileData) { const parts = doc.fileData.split(','); const mime = doc.mimeType || 'application/octet-stream'; const binary = atob(parts[1] || ''); const bytes = new Uint8Array(binary.length); for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i); blob = new Blob([bytes], { type: mime }) }
    else {
      // Generated forms export their live values while the editor is open, not stale saved text.
      const content = editing?.id === doc.id
        ? doc.id === 'fs1' ? overviewMarkdown()
          : isPolicyDocument(doc) ? policyMarkdown()
          : isDailyTemperatureDocument(doc) ? temperatureRecordMarkdown(temperatureForm)
          : isTemperatureMonitoringLog(doc) ? temperatureRecordMarkdown(editing?.id === doc.id ? temperatureMonitoringForm : temperatureMonitoringFormFromDocument(doc), 'Temperature Monitoring Log')
          : isDailyOpeningClosingDocument(doc) ? openingClosingMarkdown(openingClosingForm)
          : isCleaningRecordDocument(doc) ? cleaningRecordMarkdown(cleaningRecordFromDocument(doc))
          : isSupplierDeliveryDocument(doc) ? supplierDeliveryMarkdown(editing?.id === doc.id ? supplierDeliveryForm : supplierDeliveryFromDocument(doc))
          : isStorageRotationDocument(doc) ? storageRotationMarkdown(editing?.id === doc.id ? storageRotationForm : storageRotationFromDocument(doc))
          : isFoodProcessDocument(doc) ? foodProcessMarkdown(editing?.id === doc.id ? foodProcessForm : foodProcessFromDocument(doc))
          : isHygienePolicyDocument(doc) ? hygienePolicyMarkdown(editing?.id === doc.id ? hygienePolicyForm : hygienePolicyFromDocument(doc))
          : isManagementPackDocument(doc) ? managementPackMarkdown(managementPackFormFromDocument(doc))
          : isAllergenManagementDocument(doc) ? allergenManagementMarkdown(allergenManagementFromDocument(doc))
          : isAllergenMatrixDocument(doc) ? allergenMatrixMarkdown(editing?.id === doc.id ? allergenMatrixForm : allergenMatrixFromDocument(doc))
          : isPestWasteWaterDocument(doc) ? pestWasteWaterMarkdown(pestWasteWaterForm)
          : isTrainingRecordsDocument(doc) ? trainingRecordsMarkdown(trainingRecordsForm)
          : isDocumentReviewLog(doc) ? documentReviewMarkdown(documentReviewForm)
          
          : doc.content
        : doc.content
      blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
      if (!/\.(md|txt|csv|json)$/i.test(filename)) filename += '.md'
    }
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url)
  }
  function uploadFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach(file => {
      const isText = file.type.startsWith('text/') || /\.(md|txt|csv|json)$/i.test(file.name)
      if (file.size > 1_500_000) { setToast(`${file.name} is over 1.5 MB. This browser-only starter limits imported files; cloud file storage is planned next.`); return }
      if (isText) { const reader = new FileReader(); reader.onload = () => setDocs(old => [{ id: crypto.randomUUID(), businessId: activeBusiness, title: file.name, category: 'Uploaded files', content: String(reader.result ?? ''), updatedAt: new Date().toISOString(), type: 'document', mimeType: file.type, fileSize: file.size }, ...old]); reader.readAsText(file) }
      else { const reader = new FileReader(); reader.onload = () => setDocs(old => [{ id: crypto.randomUUID(), businessId: activeBusiness, title: file.name, category: 'Uploaded files', content: '', fileData: String(reader.result ?? ''), mimeType: file.type || 'application/octet-stream', fileSize: file.size, updatedAt: new Date().toISOString(), type: 'file' }, ...old]); reader.readAsDataURL(file) }
    })
    setToast('Import started. Small files are stored in this browser only; export a backup and connect cloud storage before relying on these records.')
  }
  function navigate(next: string) { setPage(next); setEditing(null); setMobileMenu(false); setSearch('') }
  const totalDone = safety.filter(s => s.done).length

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><BriefcaseBusiness size={21}/></div><div><strong>Business Hub</strong><span>YOUR BUSINESS WORKSPACE</span></div><button className="icon-button mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={19}/></button></div>
      <button className="workspace-picker" onClick={() => { const idx = businesses.findIndex(b => b.id === activeBusiness); setActiveBusiness(businesses[(idx + 1) % businesses.length].id); setEditing(null); setPage('overview') }}><span className={`business-dot ${active.color}`}></span><span className="workspace-name"><b>{active.name}</b><small>Current workspace</small></span><ChevronDown size={16}/></button>
      <div className="nav-label">WORKSPACE</div>
      <nav className="nav-list">
        <button className={page === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('overview')}><LayoutDashboard size={18}/>Overview</button>
        <button className={page === 'documents' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('documents')}><FileText size={18}/>Document library<span className="nav-count">{businessDocs.length}</span></button>
        <button className={page === 'safety' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('safety')}><ShieldCheck size={18}/>Food Safety Centre</button>
        <button className={page === 'safety-folder' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('safety-folder')}><Folder size={18}/>Folder 1 — Food Safety Management<span className="nav-count">{foodSafetyFolderDocs.length}</span></button>
        <button className={page === 'handling-folder' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('handling-folder')}><Archive size={18}/>Folder 2 — Food Handling &amp; Storage<span className="nav-count">{foodHandlingDocs.length}</span></button>
        <button className={page === 'businesses' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('businesses')}><Building2 size={18}/>My businesses</button>
      </nav>
      <div className="nav-label nav-label-spaced">YOUR BUSINESSES</div>
      <div className="business-list">{businesses.map(b => <button key={b.id} className={`business-nav ${activeBusiness === b.id ? 'selected' : ''}`} onClick={() => { setActiveBusiness(b.id); setEditing(null); setPage('overview'); setSearch('') }}><span className={`business-dot ${b.color}`}></span><span>{b.name}</span>{activeBusiness === b.id && <span className="selected-indicator"/>}</button>)}</div>
      <div className="sidebar-bottom"><div className={`sync-card ${online ? '' : 'offline'}`}><span className="sync-icon">{online ? <Cloud size={17}/> : <WifiOff size={17}/>}</span><div><b>{online ? 'Working on this device' : 'Offline mode'}</b><small>{online ? 'Local changes save automatically' : 'Changes stay on this device'}</small></div></div><button className="nav-item" onClick={() => setToast('Team access will be enabled after secure cloud authentication is connected.')}><Users size={18}/>Team & access</button><button className="nav-item" onClick={() => setToast('Settings and cloud connection are planned for the next milestone.')}><Settings size={18}/>Settings</button><div className="profile-row"><div className="avatar">RM</div><div><b>Business owner</b><small>Local demo profile</small></div><MoreHorizontal size={19}/></div></div>
    </aside>
    {mobileMenu && <button className="mobile-scrim" onClick={() => setMobileMenu(false)} aria-label="Close navigation"/>}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><b>{page === 'overview' ? 'Overview' : page === 'documents' ? 'Document library' : page === 'safety' ? 'Food Safety Centre' : page === 'safety-folder' ? 'Folder 1 — Food Safety Management' : page === 'handling-folder' ? 'Folder 2 — Food Handling & Storage' : 'My businesses'}</b></div></div><div className="topbar-actions"><button className="button secondary topbar-home-button" onClick={() => { setEditing(null); setShowNew(false); setPage('overview'); setSearch(''); setMobileMenu(false) }}><House size={16}/>Home</button><div className={`connection-pill ${online ? 'online' : 'offline'}`}>{online ? <Wifi size={14}/> : <WifiOff size={14}/>}<span>{online ? 'Local mode' : 'Offline'}</span></div><button className="icon-button notification-button" onClick={() => setToast('No new notifications. Cloud reminders will be added in a later version.')} aria-label="Notifications"><Bell size={19}/><i/></button><div className="avatar avatar-small">RM</div></div></header>
      <div className="page-content">
        {page === 'overview' && <>
          <section className="sk-welcome">
            <div className="sk-welcome-logo"><img src="/small-kitchen-logo.png" alt="The Small Kitchen — Big Food. Big Heart. Mobile Kitchen Nottingham" /></div>
            <div className="sk-welcome-copy">
              <div className="eyebrow">YOUR FOOD BUSINESS ORGANISER</div>
              <h1>Welcome to <span>The Small Kitchen</span></h1>
              <p>Big food. Big heart. Keep your food business paperwork organised in one place.</p>
              <div className="sk-welcome-actions">
                <button className="button primary" onClick={() => navigate('documents')}><FileText size={16}/>Open document library</button>
                <button className="button secondary" onClick={() => navigate('safety')}><ShieldCheck size={16}/>Food Safety Centre</button>
              </div>
            </div>
          </section>
          <div className="sk-section-heading"><div><div className="eyebrow">YOUR PAPERWORK</div><h2>Business folders</h2><p>Choose a folder to open the records and templates you need.</p></div><button className="button secondary" onClick={() => setShowNew(true)}><Plus size={16}/>Create document</button></div>
          <section className="sk-folder-list">
            <button className="sk-folder-card sk-folder-red" onClick={() => navigate('safety-folder')}>
              <span className="sk-folder-number">1</span><span className="sk-folder-icon"><ShieldCheck size={27}/></span><span className="sk-folder-copy"><b>Food Safety Management</b><small>HACCP, policies, temperature checks and food safety documents.</small></span><ChevronRight className="sk-folder-arrow" size={21}/>
            </button>
            <button className="sk-folder-card sk-folder-green" onClick={() => navigate('handling-folder')}>
              <span className="sk-folder-number">2</span><span className="sk-folder-icon"><Archive size={27}/></span><span className="sk-folder-copy"><b>Food Handling &amp; Storage</b><small>Supplier records, storage logs, stock control and allergen information.</small></span><ChevronRight className="sk-folder-arrow" size={21}/>
            </button>
            <button className="sk-folder-card sk-folder-blue" onClick={() => { setSearch('cleaning'); navigate('documents') }}>
              <span className="sk-folder-number">3</span><span className="sk-folder-icon"><Sparkles size={27}/></span><span className="sk-folder-copy"><b>Cleaning &amp; Sanitising</b><small>Cleaning schedules, sanitiser logs and equipment checks.</small></span><ChevronRight className="sk-folder-arrow" size={21}/>
            </button>
            <button className="sk-folder-card sk-folder-amber" onClick={() => { setSearch('preparation'); navigate('documents') }}>
              <span className="sk-folder-number">4</span><span className="sk-folder-icon"><BriefcaseBusiness size={27}/></span><span className="sk-folder-copy"><b>Home Preparation &amp; Transport</b><small>Preparation records, transport logs and temperature monitoring.</small></span><ChevronRight className="sk-folder-arrow" size={21}/>
            </button>
            <button className="sk-folder-card sk-folder-purple" onClick={() => { setSearch('council'); navigate('documents') }}>
              <span className="sk-folder-number">5</span><span className="sk-folder-icon"><FileText size={27}/></span><span className="sk-folder-copy"><b>Business &amp; Council Paperwork</b><small>Registration, permissions, insurance and correspondence.</small></span><ChevronRight className="sk-folder-arrow" size={21}/>
            </button>
            <button className="sk-folder-card sk-folder-slate" onClick={() => navigate('documents')}>
              <span className="sk-folder-number sk-folder-number-text"><FileText size={23}/></span><span className="sk-folder-icon"><BookOpenCheck size={27}/></span><span className="sk-folder-copy"><b>Templates &amp; Extras</b><small>Editable templates, useful forms and additional resources.</small></span><ChevronRight className="sk-folder-arrow" size={21}/>
            </button>
          </section>
          <section className="sk-quick-links">
            <div className="sk-section-heading compact"><div><div className="eyebrow">QUICK ACCESS</div><h2>Useful tools</h2></div></div>
            <div className="sk-quick-grid">
              <button onClick={() => navigate('safety')}><ClipboardCheck size={23}/><span>Checklists</span></button>
              <button onClick={() => navigate('documents')}><FileText size={23}/><span>Templates</span></button>
              <button onClick={() => navigate('safety')}><BookOpenCheck size={23}/><span>Guides</span></button>
              <button onClick={() => navigate('businesses')}><Settings size={23}/><span>Settings &amp; business</span></button>
            </div>
          </section>
        </>}
        {page === 'documents' && <><div className="page-heading-row"><div><div className="eyebrow">YOUR FILES</div><h1>Document library</h1><p className="page-subtitle">Create and organise working documents for {active.name}.</p></div><button className="button primary" onClick={() => setShowNew(true)}><Plus size={17}/>New document</button></div>{editing ? <section className="panel editor-panel"><div className="editor-top"><div><span className="eyebrow">DOCUMENT EDITOR</span><h2>Edit document</h2><p>Changes are saved in this browser on this device.</p></div><button className="icon-button" onClick={() => setEditing(null)} aria-label="Close editor"><X size={19}/></button></div><label className="field-label">Document title<input value={editorTitle} onChange={e => setEditorTitle(e.target.value)} placeholder="Document title"/></label>{isManagementPackDocument(editing) ? <ManagementPackEditor value={managementPackForm} onChange={setManagementPackForm}/> : (editing.id === 'fs1' || /food safety management overview/i.test(editorTitle.trim())) ? <div className="overview-form">
  <details className="overview-preview"><summary>Show the information that will be saved in the document</summary><pre>{overviewMarkdown()}</pre></details>
  <div className="overview-form-intro"><b>Complete the business details below</b><p>Use the dropdowns where available. If unsure, choose “To be confirmed” or leave the box blank rather than guessing.</p></div>
  <div className="overview-form-grid">
    <label className="field-label">Responsible person<input value={overviewForm.responsiblePerson} onChange={e => setOverviewForm(f => ({...f, responsiblePerson:e.target.value}))} placeholder="Full name"/></label>
    <label className="field-label">Business<select value={overviewForm.businessName} onChange={e => setOverviewForm(f => ({...f, businessName:e.target.value}))}><option value="">Choose business</option><option>The Small Kitchen</option><option>Other / to be confirmed</option></select></label><label className="field-label">Business / correspondence address<input value={overviewForm.businessAddress} onChange={e => setOverviewForm(f => ({...f, businessAddress:e.target.value}))} placeholder="Business address"/></label>
    <label className="field-label">Contact telephone<input type="tel" value={overviewForm.contactPhone} onChange={e => setOverviewForm(f => ({...f, contactPhone:e.target.value}))} placeholder="Telephone number"/></label>
    <label className="field-label">Contact email<input type="email" value={overviewForm.contactEmail} onChange={e => setOverviewForm(f => ({...f, contactEmail:e.target.value}))} placeholder="Email address"/></label>
    <label className="field-label">Intended trading location<input value={overviewForm.tradingLocation} onChange={e => setOverviewForm(f => ({...f, tradingLocation:e.target.value}))} placeholder="Pitch / site, or 'to be confirmed'"/></label>
    <label className="field-label">Food preparation location<select value={overviewForm.preparationLocation} onChange={e => setOverviewForm(f => ({...f, preparationLocation:e.target.value}))}><option>Trailer only</option><option>Home and trailer</option><option>Approved separate kitchen and trailer</option><option>Other — details in notes</option><option>To be confirmed with council</option></select></label>
    <label className="field-label">Food type / menu summary<input value={overviewForm.foodTypes} onChange={e => setOverviewForm(f => ({...f, foodTypes:e.target.value}))} placeholder="Describe your actual menu"/></label>
    <label className="field-label">Service style<select value={overviewForm.serviceStyle} onChange={e => setOverviewForm(f => ({...f, serviceStyle:e.target.value}))}><option>Made to order</option><option>Cooked in batches for service</option><option>Pre-prepared and reheated</option><option>Combination — explain in notes</option><option>To be confirmed</option></select></label>
    <label className="field-label">Staffing<select value={overviewForm.staffCount} onChange={e => setOverviewForm(f => ({...f, staffCount:e.target.value}))}><option>Owner only</option><option>Owner plus 1 worker</option><option>2–3 people</option><option>4 or more people</option><option>To be confirmed</option></select></label>
    <label className="field-label">Water supply<select value={overviewForm.waterSupply} onChange={e => setOverviewForm(f => ({...f, waterSupply:e.target.value}))}><option>Fresh-water tank</option><option>Mains water connection</option><option>Bottled potable water for limited use</option><option>Other — explain in notes</option><option>To be confirmed</option></select></label>
    <label className="field-label">Wastewater arrangements<select value={overviewForm.wastewater} onChange={e => setOverviewForm(f => ({...f, wastewater:e.target.value}))}><option>Separate wastewater tank</option><option>Approved fixed drainage</option><option>Other — explain in notes</option><option>To be confirmed</option></select></label>
    <label className="field-label">Refrigeration<select value={overviewForm.refrigeration} onChange={e => setOverviewForm(f => ({...f, refrigeration:e.target.value}))}><option>Fridge and/or freezer used as required</option><option>Fridge only</option><option>Freezer only</option><option>No chilled storage planned — verify suitability</option><option>To be confirmed</option></select></label>
    <label className="field-label">Hot holding<select value={overviewForm.hotHolding} onChange={e => setOverviewForm(f => ({...f, hotHolding:e.target.value}))}><option>Hot holding equipment used where required</option><option>Food cooked and served immediately</option><option>Both hot holding and immediate service</option><option>Not planned — confirm process is suitable</option><option>To be confirmed</option></select></label>
    <label className="field-label">Food hygiene training<select value={overviewForm.trainingStatus} onChange={e => setOverviewForm(f => ({...f, trainingStatus:e.target.value}))}><option>To be confirmed</option><option>Training completed — certificate to file</option><option>Training booked / in progress</option><option>Training not yet completed</option></select></label>
    <label className="field-label">Review date<input type="date" value={overviewForm.reviewDate} onChange={e => setOverviewForm(f => ({...f, reviewDate:e.target.value}))}/></label>
  </div>
  <label className="field-label overview-notes-label">Additional notes<textarea className="overview-notes" value={overviewForm.notes} onChange={e => setOverviewForm(f => ({...f, notes:e.target.value}))} placeholder="Equipment, food transport, operating hours, council advice or anything needing confirmation"/></label>
  <div className="overview-guidance"><b>Before saving</b><ul><li>Confirm home preparation arrangements with the local authority before relying on them.</li><li>Use current supplier labels and actual recipes for allergen information.</li><li>Choose procedures and temperature limits appropriate to your actual food and process; do not rely on guessed limits.</li><li>This overview is a starter document and does not replace required records or council permissions.</li></ul></div>
  </div>
 : (isPolicyDocument(editing) || editorTitle.toLowerCase().includes("food safety policy and responsibilities")) ? <div className="overview-form policy-form">
  <details className="overview-preview policy-saved-preview"><summary>Show the information that will be saved in the document</summary><pre>{policyMarkdown()}</pre></details>
  <div className="overview-form-intro"><b>Food Safety Policy and Responsibilities</b><p>Complete the business details, assign responsibilities, and review the policy with anyone who handles food. Leave anything unknown as “To be completed” rather than guessing.</p></div>
  <div className="overview-form-grid">
    <label className="field-label">Food safety lead<select value={policyForm.foodSafetyLead} onChange={e => setPolicyForm(f => ({...f, foodSafetyLead:e.target.value}))}><option value="">Choose food safety lead</option><option>Business owner</option><option>Named food safety supervisor</option><option>To be confirmed</option></select></label><label className="field-label">Food safety lead name / details<input value={policyForm.foodSafetyLeadName} onChange={e => setPolicyForm(f => ({...f, foodSafetyLeadName:e.target.value}))} placeholder="Name of owner / responsible person"/></label>
    <label className="field-label">Deputy / cover<select value={policyForm.deputy} onChange={e => setPolicyForm(f => ({...f, deputy:e.target.value}))}><option value="">Choose cover arrangement</option><option>No deputy — owner covers</option><option>Named deputy</option><option>Not applicable</option><option>To be confirmed</option></select></label>
    <label className="field-label">Business name<input value={policyForm.businessName} onChange={e => setPolicyForm(f => ({...f, businessName:e.target.value}))} placeholder="Business name"/></label><label className="field-label">Business / correspondence address<input value={policyForm.businessAddress} onChange={e => setPolicyForm(f => ({...f, businessAddress:e.target.value}))} placeholder="Business address"/></label>
    <label className="field-label">Intended trading location<input value={policyForm.tradingLocation} onChange={e => setPolicyForm(f => ({...f, tradingLocation:e.target.value}))} placeholder="Pitch / site or to be confirmed"/></label>
    <label className="field-label">Effective date<input type="date" value={policyForm.effectiveDate} onChange={e => setPolicyForm(f => ({...f, effectiveDate:e.target.value}))}/></label>
    <label className="field-label">Review date<input type="date" value={policyForm.reviewDate} onChange={e => setPolicyForm(f => ({...f, reviewDate:e.target.value}))}/></label>
    <label className="field-label">Staffing arrangement<select value={policyForm.staffRoles} onChange={e => setPolicyForm(f => ({...f, staffRoles:e.target.value}))}><option>Owner / food business operator</option><option>Owner and family helpers</option><option>Owner plus paid staff</option><option>Several food handlers</option><option>To be confirmed</option></select></label>
    <label className="field-label">Policy signed off by<input value={policyForm.signedBy} onChange={e => setPolicyForm(f => ({...f, signedBy:e.target.value}))} placeholder="Name of person approving this policy"/></label>
    <label className="field-label">Illness and fitness-to-work rule<select value={policyForm.illnessReporting} onChange={e => setPolicyForm(f => ({...f, illnessReporting:e.target.value}))}><option>Staff must report vomiting, diarrhoea, infected wounds or other symptoms before handling food</option><option>Staff must report illness and follow the written illness procedure and current official guidance</option><option>To be confirmed and written into the illness procedure</option></select></label>
    <label className="field-label">Training and supervision<select value={policyForm.training} onChange={e => setPolicyForm(f => ({...f, training:e.target.value}))}><option>Training and supervision appropriate to duties; retain evidence of training</option><option>Food handlers need induction before working and ongoing supervision</option><option>Training arrangements still to be confirmed</option></select></label>
    <label className="field-label">Allergen control<select value={policyForm.allergenControl} onChange={e => setPolicyForm(f => ({...f, allergenControl:e.target.value}))}><option>Check current supplier labels and recipes; provide accurate information and prevent cross-contact</option><option>Use a written allergen matrix and check every recipe and substitution</option><option>Allergen procedure still to be completed before service</option></select></label>
    <label className="field-label">Record keeping<select value={policyForm.recordKeeping} onChange={e => setPolicyForm(f => ({...f, recordKeeping:e.target.value}))}><option>Complete records at the time checks are made; record actual results and corrective actions</option><option>Use daily checklists and keep temperature, cleaning, delivery and corrective-action records</option><option>Record-keeping procedure still to be confirmed</option></select></label>
    <label className="field-label">Policy review frequency<select value={policyForm.reviewFrequency} onChange={e => setPolicyForm(f => ({...f, reviewFrequency:e.target.value}))}><option>At least annually and whenever the menu, process, equipment, premises or staff change</option><option>Every six months and whenever a significant change occurs</option><option>Whenever a significant change occurs; set a routine review date</option></select></label>
  </div>
  <label className="field-label">Owner / manager responsibilities<textarea value={policyForm.ownerResponsibilities} onChange={e => setPolicyForm(f => ({...f, ownerResponsibilities:e.target.value}))}/></label><label className="field-label">Food handler responsibilities<textarea value={policyForm.handlerResponsibilities} onChange={e => setPolicyForm(f => ({...f, handlerResponsibilities:e.target.value}))}/></label>
  <label className="field-label">Cleaning and disinfection responsibilities<textarea value={policyForm.cleaningResponsibilities} onChange={e => setPolicyForm(f => ({...f, cleaningResponsibilities:e.target.value}))}/></label><label className="field-label">Cross-contamination prevention<textarea value={policyForm.crossContamination} onChange={e => setPolicyForm(f => ({...f, crossContamination:e.target.value}))}/></label>
  <label className="field-label">Temperature control<textarea value={policyForm.temperatureControl} onChange={e => setPolicyForm(f => ({...f, temperatureControl:e.target.value}))}/></label><label className="field-label">Corrective actions and reporting problems<textarea value={policyForm.correctiveActions} onChange={e => setPolicyForm(f => ({...f, correctiveActions:e.target.value}))}/></label>
  <label className="field-label">Policy wording / business-specific rules<textarea value={policyForm.policyNotes || ""} onChange={e => setPolicyForm(f => ({...f, policyNotes:e.target.value}))} placeholder="Add rules specific to your menu, equipment and working methods"/></label><label className="field-label">Responsibilities and assigned shifts<textarea value={policyForm.shiftResponsibilities || ""} onChange={e => setPolicyForm(f => ({...f, shiftResponsibilities:e.target.value}))} placeholder="Who checks opening, service, closing, cleaning and records"/></label><label className="field-label">Illness reporting and action<textarea value={policyForm.illnessNotes || ""} onChange={e => setPolicyForm(f => ({...f, illnessNotes:e.target.value}))} placeholder="Who must be told, and how the person is kept away from food handling"/></label><label className="field-label">Records and reporting<textarea value={policyForm.recordNotes || ""} onChange={e => setPolicyForm(f => ({...f, recordNotes:e.target.value}))} placeholder="Who completes checks, records problems and reports corrective actions"/></label><label className="field-label">Additional notes<textarea className="overview-notes" value={policyForm.notes} onChange={e => setPolicyForm(f => ({...f, notes:e.target.value}))} placeholder="Add role-specific duties, deputy arrangements, review notes or local-authority advice"/></label>
  <div className="overview-guidance"><b>Before approving this policy</b><ul><li>Enter the actual names and dates and make sure the responsibilities reflect how your business operates.</li><li>Explain the policy to everyone who handles food and keep training or induction evidence where applicable.</li><li>Check your separate allergen, cleaning, temperature, illness and corrective-action procedures are in place.</li><li>Do not sign off arrangements that are not yet operating; complete the missing procedures before relying on them.</li></ul></div>
  <details className="overview-preview"><summary>Show the policy that will be saved in the document</summary><pre>{policyMarkdown()}</pre></details>
</div> : isAllergenManagementDocument(editing) ? <AllergenManagementEditor value={allergenManagementForm} onChange={setAllergenManagementForm}/> : isAllergenMatrixDocument(editing) ? <AllergenMatrixEditor value={allergenMatrixForm} onChange={setAllergenMatrixForm}/> : isFoodProcessDocument(editing) ? <FoodProcessEditor value={foodProcessForm} onChange={setFoodProcessForm}/> : isTrainingRecordsDocument(editing) ? <TrainingRecordsEditor value={trainingRecordsForm} onChange={setTrainingRecordsForm}/> : isDocumentReviewLog(editing) ? <DocumentReviewEditor value={documentReviewForm} onChange={setDocumentReviewForm}/> : isPestWasteWaterDocument(editing) ? <PestWasteWaterEditor value={pestWasteWaterForm} onChange={setPestWasteWaterForm}/> : isHygienePolicyDocument(editing) ? <HygienePolicyEditor value={hygienePolicyForm} onChange={setHygienePolicyForm}/> : isStorageRotationDocument(editing) ? <StorageRotationEditor value={storageRotationForm} onChange={setStorageRotationForm}/> : isSupplierDeliveryDocument(editing) ? <SupplierDeliveryEditor value={supplierDeliveryForm} onChange={setSupplierDeliveryForm}/> : isTemperatureMonitoringLog(editing) ? <TemperatureRecordEditor title="Temperature Monitoring Log" value={temperatureMonitoringForm} onChange={setTemperatureMonitoringForm}/> : isCleaningRecordDocument(editing) ? <CleaningRecordEditor value={cleaningForm} onChange={setCleaningForm}/> : isDailyOpeningClosingDocument(editing) ? <OpeningClosingEditor value={openingClosingForm} onChange={setOpeningClosingForm}/> : isDailyTemperatureDocument(editing) ? <TemperatureRecordEditor value={temperatureForm} onChange={setTemperatureForm}/> : <label className="field-label">Document content<textarea className="editor-textarea" value={editorContent} onChange={e => setEditorContent(e.target.value)} placeholder="Write your document here..." spellCheck/></label>}<div className="editor-footer"><span className="autosave-note"><Check size={15}/> Local draft is available</span><div className="button-row"><button className="button secondary" onClick={() => exportDoc({ ...editing, title: editorTitle, content: editorContent })}><ArrowDownToLine size={16}/>Export .md</button><button className="button primary" onClick={saveEditor}>Save changes</button></div></div>{!(isPolicyDocument(editing) || isDailyTemperatureDocument(editing) || isDailyOpeningClosingDocument(editing) || isCleaningRecordDocument(editing) || isSupplierDeliveryDocument(editing) || isStorageRotationDocument(editing) || isFoodProcessDocument(editing) || isHygienePolicyDocument(editing) || isManagementPackDocument(editing) || isTemperatureMonitoringLog(editing) || isAllergenMatrixDocument(editing) || isAllergenManagementDocument(editing) || isPestWasteWaterDocument(editing) || isTrainingRecordsDocument(editing) || isDocumentReviewLog(editing)) && <p className="editor-note">This first version edits plain text/Markdown. Word and PDF round-trip editing will be added separately; imported binary files are not stored by this prototype.</p>}</section> : <><div className="library-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."/></div><button className="button secondary" onClick={() => fileInput.current?.click()}><ArrowUpFromLine size={16}/>Import file</button></div><section className="panel library-panel"><div className="library-table-head"><span>NAME</span><span>CATEGORY</span><span>UPDATED</span><span>ACTIONS</span></div>{filteredDocs.map(doc => <div className="library-row" key={doc.id}><button className="library-name" onClick={() => doc.type === 'file' ? setToast('This file type is not editable in the current prototype.') : openEditor(doc)}><span className={`file-icon ${doc.type === 'record' ? 'file-record' : ''}`}><FileText size={18}/></span><span><b>{doc.title}</b><small>{doc.type === 'record' ? 'Record template' : doc.type === 'file' ? 'File reference' : 'Editable document'}</small></span></button><span className="category-cell">{doc.category}</span><span className="updated-cell">{prettyDate(doc.updatedAt)}</span><div className="row-actions"><button className="icon-button" onClick={() => exportDoc(doc)} aria-label={`Export ${doc.title}`}><ArrowDownToLine size={17}/></button><button className="icon-button" onClick={() => doc.type === 'file' ? setToast('Binary files can be downloaded, but preview/editing is not included yet.') : openEditor(doc)} aria-label={`Edit ${doc.title}`}><Pencil size={16}/></button></div></div>)}{filteredDocs.length === 0 && <EmptyState title="Nothing found" text="Try another search or create a new document."/>}</section><div className="library-footnote"><ShieldCheck size={16}/> Your documents are currently stored in this browser only. Connect cloud storage before using this for important records.</div></>}</>}
        {page === 'safety' && <><div className="page-heading-row"><div><div className="eyebrow">THE SMALL KITCHEN</div><h1>Food Safety Centre</h1><p className="page-subtitle">Build and maintain the working documents for your food trailer.</p></div><button className="button secondary" onClick={() => { const doc = docs.find(d => d.id === 'd1'); if (doc) openEditor(doc) }}><FileText size={16}/>Open management pack</button></div><div className="safety-banner"><div className="safety-banner-icon"><ShieldCheck size={25}/></div><div className="safety-banner-copy"><h2>Your food safety pack</h2><p>A structured starting point for your procedures and records. Tick a section when the actual document has been prepared and reviewed.</p></div><div className="safety-progress"><strong>{totalDone}/{safety.length}</strong><span>Sections checked</span></div></div><section className="panel safety-panel"><div className="panel-heading"><div><h3>Pack setup checklist</h3><p>Progress is saved in this browser.</p></div><span className="progress-tag">{Math.round(totalDone / safety.length * 100)}% complete</span></div><div className="progress-track"><div style={{ width: `${totalDone / safety.length * 100}%` }}/></div><div className="safety-list">{safety.map(item => <label key={item.id} className={`safety-row ${item.done ? 'checked' : ''}`}><input type="checkbox" checked={item.done} onChange={e => setSafety(old => old.map(s => s.id === item.id ? { ...s, done: e.target.checked } : s))}/><span className="safety-checkbox"><Check size={14}/></span><span className="safety-text"><b>{item.title}</b><small>{item.detail}</small></span><span className={`status-pill ${item.done ? 'status-done' : 'status-todo'}`}>{item.done ? 'Marked complete' : 'To review'}</span></label>)}</div></section><div className="notice-card"><CircleHelp size={19}/><p><b>Important:</b> this checklist is an organisational aid, not proof of compliance. Use current Food Standards Agency guidance and ensure your procedures reflect your actual menu, equipment, food preparation locations and working practices. Never guess allergen details or mark a safety check complete unless it has actually been done.</p></div><section className="panel safety-docs-panel"><div className="panel-heading"><div><h3>Starter documents</h3><p>Open and adapt the templates for your setup.</p></div><button className="text-link" onClick={() => navigate('documents')}>View all <ChevronRight size={15}/></button></div>{businessDocs.filter(d => ['Food safety','Daily records','Temperature records','Allergens'].includes(d.category)).map(doc => <DocumentRow key={doc.id} doc={doc} onOpen={openEditor} onExport={exportDoc}/>)}</section></>}
        {page === 'safety-folder' && <><div className="page-heading-row safety-folder-page-heading"><div><div className="eyebrow">THE SMALL KITCHEN · FOLDER 1</div><h1>Food Safety Management</h1><p className="page-subtitle">Your main food safety paperwork. Open a template to edit it, then save or export a copy for your records.</p></div><div className="page-heading-actions"><button className="button primary" onClick={() => { setNewCategory('Folder 1 — Food Safety Management'); setShowNew(true) }}><Plus size={17}/>Add document</button></div></div><div className="safety-banner"><div className="safety-banner-icon"><ShieldCheck size={25}/></div><div className="safety-banner-copy"><h2>Food Safety Management</h2><p>Keep policies, procedures and completed monitoring records together. These are starter templates: adapt them to your actual trailer, menu, equipment and working methods before use.</p></div><div className="safety-progress"><strong>{businessDocs.filter(d => d.category === 'Folder 1 — Food Safety Management').length}</strong><span>Documents</span></div></div><section className="panel library-panel"><div className="library-table-head"><span>DOCUMENT</span><span>CATEGORY</span><span>UPDATED</span><span>ACTIONS</span></div>{businessDocs.filter(d => d.category === 'Folder 1 — Food Safety Management').map(doc => <div className="library-row" key={doc.id}><button className="library-name" onClick={() => openEditor(doc)}><span className={`file-icon ${doc.type === 'record' ? 'file-record' : ''}`}><FileText size={18}/></span><span><b>{doc.title}</b><small>{doc.type === 'record' ? 'Record template' : 'Editable document'}</small></span></button><span className="category-cell">Food safety</span><span className="updated-cell">{prettyDate(doc.updatedAt)}</span><div className="row-actions"><button className="icon-button" onClick={() => exportDoc(doc)} aria-label={`Export ${doc.title}`}><ArrowDownToLine size={17}/></button><button className="icon-button" onClick={() => openEditor(doc)} aria-label={`Edit ${doc.title}`}><Pencil size={16}/></button></div></div>)}</section><div className="notice-card"><CircleHelp size={19}/><p><b>Important:</b> these are blank starter templates, not completed compliance records or official approval. Record real checks accurately and use current Food Standards Agency guidance. Verify all allergen details against the actual recipes and supplier labels.</p></div></>}
        {page === 'handling-folder' && <><div className="page-heading-row safety-folder-page-heading"><div><div className="eyebrow">THE SMALL KITCHEN · FOLDER 2</div><h1>Food Handling &amp; Storage</h1><p className="page-subtitle">Supplier records, storage logs, stock control and allergen information. Open a template to edit it, then save or export a copy for your records.</p></div><div className="page-heading-actions"><button className="button primary" onClick={() => { setNewCategory(foodHandlingCategory); setShowNew(true) }}><Plus size={17}/>Add document</button></div></div><div className="safety-banner"><div className="safety-banner-icon"><Archive size={25}/></div><div className="safety-banner-copy"><h2>Food Handling &amp; Storage</h2><p>This folder contains supplier and delivery records, food storage and stock rotation records, and allergen documents.</p></div><div className="safety-progress"><strong>{foodHandlingDocs.length}</strong><span>Documents</span></div></div><section className="panel library-panel"><div className="library-table-head"><span>DOCUMENT</span><span>CATEGORY</span><span>UPDATED</span><span>ACTIONS</span></div>{foodHandlingDocs.map(doc => <div className="library-row" key={doc.id}><button className="library-name" onClick={() => openEditor(doc)}><span className={`file-icon ${doc.type === 'record' ? 'file-record' : ''}`}><FileText size={18}/></span><span><b>{doc.title}</b><small>{doc.type === 'record' ? 'Record template' : 'Editable document'}</small></span></button><span className="category-cell">Supplier, storage &amp; allergens</span><span className="updated-cell">{prettyDate(doc.updatedAt)}</span><div className="row-actions"><button className="icon-button" onClick={() => exportDoc(doc)} aria-label={`Export ${doc.title}`}><ArrowDownToLine size={17}/></button><button className="icon-button" onClick={() => openEditor(doc)} aria-label={`Edit ${doc.title}`}><Pencil size={16}/></button></div></div>)}</section><div className="notice-card"><CircleHelp size={19}/><p><b>Allergen reminder:</b> verify every ingredient against current supplier labels and recipes, and update the matrix whenever suppliers, ingredients or menu items change.</p></div></>}
        {page === 'businesses' && <><div className="page-heading-row"><div><div className="eyebrow">WORKSPACE MANAGEMENT</div><h1>My businesses</h1><p className="page-subtitle">Keep documents and working records separated by business.</p></div></div><div className="business-card-grid">{businesses.map(b => <button key={b.id} className={`business-card ${activeBusiness === b.id ? 'business-card-active' : ''}`} onClick={() => { setActiveBusiness(b.id); setPage('overview'); setEditing(null) }}><div className={`business-card-icon ${b.color}`}>{b.id === 'kitchen' ? <BriefcaseBusiness size={23}/> : b.id === 'events' ? <Sparkles size={23}/> : <House size={23}/>}</div><div className="business-card-copy"><b>{b.name}</b><span>{b.subtitle}</span><small>{docs.filter(d => d.businessId === b.id).length} documents in this browser</small></div><ChevronRight size={18}/></button>)}</div><div className="notice-card"><Users size={19}/><p><b>Team access is not connected yet.</b> Secure invitations, roles and shared access will be added with authentication and the cloud database. The current demo profile is local to this browser.</p></div></>}
      </div><footer className="app-footer"><span>Business Hub <span className="footer-dot">•</span> Starter version</span><span className="footer-status"><span className={`tiny-dot ${online ? '' : 'is-offline'}`}/>{online ? 'Browser storage active' : 'Offline — changes remain local'}</span></footer>
    </main>
    {showNew && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowNew(false) }}><form className="modal" onSubmit={e => { e.preventDefault(); createDoc() }}><div className="modal-head"><div><span className="eyebrow">NEW FILE</span><h2>Create a document</h2><p>New file in {active.name}</p></div><button type="button" className="icon-button" onClick={() => setShowNew(false)} aria-label="Close"><X size={19}/></button></div><label className="field-label">Document name<input autoFocus required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Weekly cleaning schedule"/></label><label className="field-label">Category<select value={newCategory} onChange={e => setNewCategory(e.target.value)}><option>General</option><option>Food safety</option><option>Daily records</option><option>Temperature records</option><option>Cleaning</option><option>Allergens</option><option>Suppliers</option><option>Health & safety</option><option>Client documents</option><option>Policies</option></select></label><div className="modal-actions"><button type="button" className="button secondary" onClick={() => setShowNew(false)}>Cancel</button><button type="submit" className="button primary"><Plus size={16}/>Create & edit</button></div></form></div>}
    {toast && <div className="toast"><Check size={17}/>{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={15}/></button></div>}
  </div>
}

function TemperatureRecordEditor({ value, onChange, title = 'Daily temperature checks' }: { value: TemperatureRecordForm; onChange: (value: TemperatureRecordForm) => void; title?: string }) {
  const updateCheck = (index: number, key: keyof TemperatureCheck, next: string) => onChange({ ...value, checks: value.checks.map((check, i) => i === index ? { ...check, [key]: next } : check) })
  return <div className="overview-form temperature-record-form">
    <div className="overview-form-intro"><b>{title}</b><p>Record actual readings against the limits in your own food safety procedures. Do not guess or use one limit for every food or process.</p></div>
    <div className="overview-form-grid">
      <label className="field-label">Date<input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })}/></label>
      <label className="field-label">Person completing checks<input value={value.completedBy} onChange={e => onChange({ ...value, completedBy: e.target.value })} placeholder="Name or initials"/></label>
    </div>
    <div className="temperature-check-list"><div className="temperature-check-list-heading"><div><h3>Readings</h3><p>Add a row for each check made today.</p></div><button className="button secondary" type="button" onClick={() => onChange({ ...value, checks: [...value.checks, blankTemperatureCheck()] })}><Plus size={16}/>Add reading</button></div>
      {value.checks.map((check, index) => <section className="temperature-check-card" key={index}><div className="temperature-check-card-heading"><b>Reading {index + 1}</b>{value.checks.length > 1 && <button className="text-link temperature-remove" type="button" onClick={() => onChange({ ...value, checks: value.checks.filter((_, i) => i !== index) })}>Remove</button>}</div>
        <div className="temperature-check-grid">
          <label className="field-label">Time<input type="time" value={check.time} onChange={e => updateCheck(index, 'time', e.target.value)}/></label>
          <label className="field-label">Equipment / food<input value={check.item} onChange={e => updateCheck(index, 'item', e.target.value)} placeholder="e.g. fridge, cooked batch, delivery"/></label>
          <label className="field-label">Actual temperature (°C)<input type="number" step="0.1" inputMode="decimal" value={check.actual} onChange={e => updateCheck(index, 'actual', e.target.value)} placeholder="Actual reading"/></label>
          <label className="field-label">Business limit<input value={check.limit} onChange={e => updateCheck(index, 'limit', e.target.value)} placeholder="From your procedure"/></label>
          <label className="field-label">Result<select value={check.result} onChange={e => updateCheck(index, 'result', e.target.value)}><option value="">Choose result</option><option>Within limit</option><option>Outside limit</option><option>Not applicable</option></select></label>
          <label className="field-label temperature-action-field">Corrective action<textarea value={check.action} onChange={e => updateCheck(index, 'action', e.target.value)} placeholder="If outside limit, record action and follow-up"/></label>
          <label className="field-label">Initials<input value={check.initials} onChange={e => updateCheck(index, 'initials', e.target.value)} placeholder="Initials"/></label>
        </div>
      </section>)}
    </div>
    <label className="field-label">Additional notes<textarea className="overview-notes" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Follow-up, equipment concerns or other relevant details"/></label>
    <div className="overview-guidance"><b>Record keeping</b><ul><li>Use the limits and check frequency from your current procedures; they depend on the food and process.</li><li>Record real readings at the time of the check, including a zero only when that is the actual reading.</li><li>For an out-of-limit result, protect customers, assess affected food, record the action and note who verified it.</li><li>Use a suitable, clean thermometer where required by the procedure.</li></ul></div>
    <details className="overview-preview"><summary>Show the record that will be saved</summary><pre>{temperatureRecordMarkdown(value, title)}</pre></details>
  </div>
}

function AllergenManagementEditor({ value, onChange }: { value: AllergenManagementForm; onChange: (value: AllergenManagementForm) => void }) {
  const area = (key: 'ingredientChecks' | 'recipeChanges' | 'crossContact' | 'customerInformation' | 'staffTraining' | 'ppds' | 'notes', label: string, placeholder: string) => <label className="field-label">{label}<textarea value={value[key]} onChange={e => onChange({ ...value, [key]: e.target.value })} placeholder={placeholder}/></label>
  return <div className="overview-form allergen-management-form">
    <div className="overview-form-intro"><b>Allergen management policy and allergen matrix</b><p>Set out how allergen information is checked, communicated and kept safe during preparation. Maintain the menu matrix below against actual recipes and current supplier information.</p></div>
    <details className="overview-preview"><summary>Show the policy and matrix that will be saved</summary><pre>{allergenManagementMarkdown(value)}</pre></details>
    <section className="management-pack-section"><h3>Policy ownership and review</h3><div className="overview-form-grid">
      <label className="field-label">Business name<input value={value.business} onChange={e => onChange({ ...value, business: e.target.value, matrix: { ...value.matrix, business: e.target.value } })}/></label>
      <label className="field-label">Responsible person<input value={value.responsible} onChange={e => onChange({ ...value, responsible: e.target.value })} placeholder="Person maintaining the policy and matrix"/></label>
      <label className="field-label">Last reviewed<input type="date" value={value.lastReviewed} onChange={e => onChange({ ...value, lastReviewed: e.target.value, matrix: { ...value.matrix, lastReviewed: e.target.value } })}/></label>
      <label className="field-label">Business name in menu matrix<input value={value.matrix.business} onChange={e => onChange({ ...value, matrix: { ...value.matrix, business: e.target.value } })}/></label>
    </div>
    {area('ingredientChecks','Ingredient and supplier checks','Recipe sheets, current supplier labels and product specifications; where records are kept.')}
    {area('recipeChanges','Recipe changes and substitutions','How a substitution or supplier / recipe change is checked and reflected in customer information.')}
    </section>
    <section className="management-pack-section"><h3>Handling and customer information</h3>
      {area('crossContact','Cross-contact prevention','Storage segregation, cleaning, handwashing, utensils, equipment and shared cooking oil controls.')}
      {area('customerInformation','Customer information and escalation','Written information, customer conversations, delivery information, and what staff do when details cannot be confirmed.')}
      {area('staffTraining','Staff training and communication','How staff find the current information, relay orders and escalate questions.')}
      {area('ppds','Prepacked for direct sale (PPDS)','How full ingredients labels are checked and regulated allergens are emphasised where applicable.')}
    </section>
    <section className="management-pack-section allergen-management-matrix"><h3>Menu allergen matrix</h3><p className="management-pack-help">One row per menu item. Mark only allergens verified in ingredients; use the cross-contact field for handling risks.</p><AllergenMatrixEditor value={value.matrix} onChange={matrix => onChange({ ...value, matrix })}/></section>
    {area('notes','Additional notes and actions','Outstanding checks, training or improvements, with responsible person and target date.')}
    <div className="overview-guidance"><b>Keep allergen information reliable</b><ul><li>Check recipes and product labels and update the information when ingredients or suppliers change.</li><li>Keep allergen information available in writing and support it with a conversation with customers.</li><li>Use practical cleaning, segregation and handwashing controls to reduce cross-contact; do not give unsupported assurances.</li><li>Review the policy and matrix after menu, supplier, equipment or preparation changes.</li></ul></div>
  </div>
}

function AllergenMatrixEditor({ value, onChange }: { value: AllergenMatrixForm; onChange: (value: AllergenMatrixForm) => void }) {
  const update = (index: number, key: keyof AllergenMenuItem, next: string | string[]) => onChange({ ...value, items: value.items.map((item, i) => i === index ? { ...item, [key]: next } : item) })
  const toggleAllergen = (index: number, allergen: string, checked: boolean) => {
    const selected = value.items[index].allergens
    update(index, 'allergens', checked ? [...selected, allergen] : selected.filter(item => item !== allergen))
  }
  return <div className="overview-form allergen-matrix-form">
    <div className="overview-form-intro"><b>Allergen Matrix — Menu</b><p>Enter every menu item and mark regulated allergens only after checking the recipe and current supplier information.</p></div>
    <div className="overview-form-grid allergen-matrix-meta">
      <label className="field-label">Business name<input value={value.business} onChange={e => onChange({ ...value, business: e.target.value })}/></label>
      <label className="field-label">Matrix last reviewed<input type="date" value={value.lastReviewed} onChange={e => onChange({ ...value, lastReviewed: e.target.value })}/></label>
    </div>
    <div className="temperature-check-list"><div className="temperature-check-list-heading"><div><h3>Menu items</h3><p>Add one row for each dish, drink, sauce or other item you serve.</p></div><button className="button secondary" type="button" onClick={() => onChange({ ...value, items: [...value.items, blankAllergenMenuItem()] })}><Plus size={16}/>Add menu item</button></div>
      {value.items.map((item, index) => <section className="temperature-check-card allergen-menu-card" key={index}><div className="temperature-check-card-heading"><b>Menu item {index + 1}</b>{value.items.length > 1 && <button className="text-link temperature-remove" type="button" onClick={() => onChange({ ...value, items: value.items.filter((_, i) => i !== index) })}>Remove</button>}</div>
        <div className="overview-form-grid allergen-item-fields">
          <label className="field-label">Menu item name<input value={item.name} onChange={e => update(index, 'name', e.target.value)} placeholder="Dish or product name"/></label>
          <label className="field-label">Ingredients / source checked<textarea value={item.ingredients} onChange={e => update(index, 'ingredients', e.target.value)} placeholder="Recipe, brands and supplier labels checked"/></label>
        </div>
        <fieldset className="allergen-checkboxes"><legend>Allergens confirmed in this item</legend>{regulatedAllergens.map(allergen => <label key={allergen} className="allergen-option"><input type="checkbox" checked={item.allergens.includes(allergen)} onChange={e => toggleAllergen(index, allergen, e.target.checked)}/><span>{allergen}</span></label>)}</fieldset>
        <label className="field-label allergen-cross-contact">Cross-contact controls / information<textarea value={item.crossContact} onChange={e => update(index, 'crossContact', e.target.value)} placeholder="Preparation controls and any relevant cross-contact risk information"/></label>
        <div className="overview-form-grid allergen-verification-fields"><label className="field-label">Verified by<input value={item.verifiedBy} onChange={e => update(index, 'verifiedBy', e.target.value)} placeholder="Name or initials"/></label><label className="field-label">Date verified<input type="date" value={item.verifiedDate} onChange={e => update(index, 'verifiedDate', e.target.value)}/></label></div>
      </section>)}
    </div>
    <label className="field-label">Additional notes<textarea value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Substitution checks, sources, pending verification or review notes"/></label>
    <div className="overview-guidance"><b>Verification and customer information</b><ul><li>The matrix lists the 14 regulated allergens; verify each item against its recipe and current supplier labels, including changes and substitutions.</li><li>Record allergens present as ingredients. Keep cross-contact controls and any risk information clear and separate.</li><li>Do not guess or make unsupported “free from” claims. If information cannot be verified, resolve it before giving an assurance to a customer.</li><li>Keep staff information current and encourage an allergy conversation alongside written information.</li></ul></div>
    <details className="overview-preview"><summary>Show the matrix that will be saved</summary><pre>{allergenMatrixMarkdown(value)}</pre></details>
  </div>
}

function ManagementPackEditor({ value, onChange }: { value: ManagementPackForm; onChange: (value: ManagementPackForm) => void }) {
  const text = (key: keyof ManagementPackForm, label: string, placeholder: string) => <label className="field-label">{label}<textarea value={value[key]} onChange={e => onChange({ ...value, [key]: e.target.value })} placeholder={placeholder}/></label>
  return <div className="overview-form management-pack-form">
    <div className="overview-form-intro"><b>Food Safety Management Pack</b><p>Describe how food safety is managed in this business. Complete the details for your actual menu, premises and equipment, and keep the referenced records up to date.</p></div>
    <details className="overview-preview"><summary>Show the pack that will be saved</summary><pre>{managementPackMarkdown(value)}</pre></details>
    <section className="management-pack-section"><h3>Business and review details</h3><div className="overview-form-grid">
      <label className="field-label">Business name<input value={value.business} onChange={e => onChange({ ...value, business: e.target.value })}/></label>
      <label className="field-label">Food safety lead<input value={value.responsible} onChange={e => onChange({ ...value, responsible: e.target.value })} placeholder="Name or role"/></label>
      <label className="field-label">Deputy / cover<input value={value.deputy} onChange={e => onChange({ ...value, deputy: e.target.value })} placeholder="Name, arrangement, or not applicable"/></label>
      <label className="field-label">Review frequency<select value={value.reviewFrequency} onChange={e => onChange({ ...value, reviewFrequency: e.target.value })}><option>At least annually and whenever something changes</option><option>Every six months and whenever something changes</option><option>Whenever a significant change occurs</option><option>To be agreed</option></select></label>
      <label className="field-label">Next review date<input type="date" value={value.reviewDate} onChange={e => onChange({ ...value, reviewDate: e.target.value })}/></label>
    </div>{text('operation','Business and food operation','Premises, trading locations, service style, staffing and equipment.')}{text('menu','Menu and food handled','Describe food types, ingredients, high-risk foods and how they are served.')}</section>
    <section className="management-pack-section"><h3>Food safety procedures</h3>
      {text('preparation','Preparation, cooking, cooling and reheating','Describe the steps used for your actual processes, including how checks are verified.')}
      {text('crossContamination','Cross-contamination prevention','How raw and ready-to-eat foods, utensils, equipment and surfaces are kept separate or effectively cleaned.')}
      {text('temperature','Temperature control','Chilled storage, cooking, cooling, reheating and hot holding checks; identify where the business limits are recorded.')}
      {text('cleaning','Cleaning and disinfection','Refer to the cleaning schedule, product instructions, task frequency and how completion is checked.')}
      {text('allergens','Allergen management','How recipes and current supplier labels are checked, customer questions handled and cross-contact controlled.')}
      {text('deliveries','Deliveries and suppliers','Acceptance checks, traceability details, rejected deliveries and supplier issue handling.')}
      {text('storage','Food storage and stock rotation','Separation, covering, labelling, date marking, stock rotation and disposal arrangements.')}
      {text('illness','Personal hygiene and illness reporting','Handwashing, protective clothing, illness reporting and decisions about fitness to handle food.')}
      {text('correctiveActions','Corrective action and incidents','How unsafe food or failed checks are controlled, recorded, escalated and followed up.')}
      {text('training','Training and supervision','Induction, task-specific instruction, supervision and training evidence.')}
    </section>
    <section className="management-pack-section"><h3>Records and local notes</h3>{text('records','Supporting records and where they are kept','List the records used, who completes or checks them, and where completed copies are retained.')}{text('notes','Additional notes and actions','Anything not yet in place, actions needed, responsible person and target date.')}</section>
    <div className="overview-guidance"><b>Before relying on this pack</b><ul><li>Complete each section from the way the business actually operates; do not leave guessed procedures in place.</li><li>Set process limits using current official guidance and the food and equipment used.</li><li>Keep completed daily records, staff training evidence and supplier information with the pack.</li><li>Review the pack after a menu, supplier, equipment, location or working-method change and after a food safety incident.</li></ul></div>
  </div>
}

function SupplierDeliveryEditor({ value, onChange }: { value: SupplierDeliveryForm; onChange: (value: SupplierDeliveryForm) => void }) {
  const update = (index: number, key: keyof SupplierDelivery, next: string) => onChange({ ...value, records: value.records.map((row, i) => i === index ? { ...row, [key]: next } : row) })
  return <div className="overview-form supplier-delivery-form">
    <div className="overview-form-intro"><b>Supplier and delivery records</b><p>Record each delivery when it arrives. Use the business's actual acceptance criteria and retain invoices or other traceability evidence.</p></div>
    <div className="overview-form-grid"><label className="field-label">Delivery date<input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })}/></label></div>
    <div className="temperature-check-list"><div className="temperature-check-list-heading"><div><h3>Delivery checks</h3><p>Add a separate row for each supplier delivery or product group.</p></div><button className="button secondary" type="button" onClick={() => onChange({ ...value, records: [...value.records, blankSupplierDelivery()] })}><Plus size={16}/>Add delivery</button></div>
      {value.records.map((row, index) => <section className="temperature-check-card supplier-delivery-card" key={index}><div className="temperature-check-card-heading"><b>Delivery {index + 1}</b>{value.records.length > 1 && <button className="text-link temperature-remove" type="button" onClick={() => onChange({ ...value, records: value.records.filter((_, i) => i !== index) })}>Remove</button>}</div>
        <div className="supplier-delivery-grid">
          <label className="field-label">Arrival time<input type="time" value={row.time} onChange={e => update(index, 'time', e.target.value)}/></label>
          <label className="field-label">Supplier<input value={row.supplier} onChange={e => update(index, 'supplier', e.target.value)} placeholder="Supplier / business name"/></label>
          <label className="field-label">Product<input value={row.product} onChange={e => update(index, 'product', e.target.value)} placeholder="Food or ingredient delivered"/></label>
          <label className="field-label">Quantity<input value={row.quantity} onChange={e => update(index, 'quantity', e.target.value)} placeholder="Quantity and unit"/></label>
          <label className="field-label">Batch / use-by / traceability<input value={row.batchUseBy} onChange={e => update(index, 'batchUseBy', e.target.value)} placeholder="Batch, lot or date code; use-by if relevant"/></label>
          <label className="field-label">Packaging and condition<select value={row.condition} onChange={e => update(index, 'condition', e.target.value)}><option value="">Select condition</option><option>Acceptable</option><option>Damaged</option><option>Contaminated / leaking</option><option>Other concern</option></select></label>
          <label className="field-label">Temperature, if required<input value={row.temperature} onChange={e => update(index, 'temperature', e.target.value)} placeholder="Actual reading and unit (e.g. °C)"/></label>
          <label className="field-label">Delivery decision<select value={row.decision} onChange={e => update(index, 'decision', e.target.value)}><option>Not checked</option><option>Accepted</option><option>Rejected</option><option>Held / isolated</option></select></label>
          <label className="field-label">Checked by<input value={row.checkedBy} onChange={e => update(index, 'checkedBy', e.target.value)} placeholder="Name or initials"/></label>
          <label className="field-label supplier-delivery-action">Issue / action<textarea value={row.issueAction} onChange={e => update(index, 'issueAction', e.target.value)} placeholder="Reason for rejection / isolation, supplier contact, corrective action and follow-up"/></label>
        </div>
      </section>)}
    </div>
    <label className="field-label">Additional notes<textarea className="overview-notes" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Where invoices and traceability records are kept, or local follow-up notes"/></label>
    <div className="overview-guidance"><b>Check and record deliveries accurately</b><ul><li>Check supplier, product, quantity, packaging, contamination, dates and traceability as relevant to the goods.</li><li>Record a temperature only where the product and your documented procedure require it; record the actual result and unit.</li><li>Use documented business limits. If goods are unsafe or outside acceptance criteria, reject or isolate them and record the reason and action.</li><li>Keep invoices and delivery notes so products can be traced. Complete the record at the time; never guess or backdate details.</li></ul></div>
    <details className="overview-preview"><summary>Show the record that will be saved</summary><pre>{supplierDeliveryMarkdown(value)}</pre></details>
  </div>
}

function HygienePolicyEditor({ value, onChange }: { value: HygienePolicyForm; onChange: (value: HygienePolicyForm) => void }) {
  const field = (key: keyof HygienePolicyForm, label: string, placeholder: string) => <label className="field-label" key={key}>{label}<textarea value={value[key]} onChange={e => onChange({ ...value, [key]: e.target.value })} placeholder={placeholder}/></label>
  return <div className="overview-form hygiene-policy-form">
    <div className="overview-form-intro"><b>Personal hygiene and staff illness policy</b><p>Set out the hygiene rules, how staff report illness, and who decides whether a person can handle food. Adapt the template to your team and follow current official advice.</p></div>
    <div className="overview-form-grid hygiene-policy-meta"><label className="field-label">Business<input value={value.business} onChange={e => onChange({ ...value, business: e.target.value })}/></label><label className="field-label">Person responsible for decisions<input value={value.responsible} onChange={e => onChange({ ...value, responsible: e.target.value })} placeholder="Name or role"/></label><label className="field-label">Review date<input type="date" value={value.reviewDate} onChange={e => onChange({ ...value, reviewDate: e.target.value })}/></label></div>
    <section className="hygiene-policy-section"><h3>Personal hygiene at work</h3><p>Write down the steps staff must follow during food handling.</p>{field('handwashing','Handwashing rules','When, where and how staff wash and dry hands')}{field('clothing','Work clothing and hair','Clean clothing, hair restraint and changing contaminated clothing')}{field('wounds','Cuts, wounds and skin infections','How wounds are covered and when staff report them')}{field('hygiene','Other personal hygiene rules','Eating, smoking, personal items and ready-to-eat food handling')}</section>
    <section className="hygiene-policy-section"><h3>Illness reporting and fitness to work</h3><p>Make the reporting route clear before a shift starts.</p>{field('symptoms','Symptoms and illness staff must report','Include vomiting, diarrhoea, stomach symptoms, fever, jaundice and infected wounds')}
      <label className="field-label">How to report<select value={value.reportingRoute} onChange={e => onChange({ ...value, reportingRoute: e.target.value })}><option>Report to the shift lead or food safety lead before the shift, by phone or in person. If unavailable, contact the named deputy. Do not attend to handle food until the person in charge has discussed fitness for work and agreed the next step.</option><option>Contact the food safety lead by phone before the shift; do not report for food handling until advised.</option><option>Contact the named deputy if the food safety lead is unavailable; record the report and decision.</option><option>To be confirmed — set a named contact and reporting method.</option></select></label>
      {field('exclusion','Exclusion from food handling','What happens while a staff member has symptoms or may contaminate food')}{field('returnToWork','Return-to-work rule','Explain the symptom-free period and when further advice is needed')}{field('assessment','Fitness-to-work assessment and decision record','What the manager records, who decides and how uncertainty is handled')}</section>
    <section className="hygiene-policy-section"><h3>Briefing, training and records</h3><p>Keep staff instructions practical and decisions traceable.</p>{field('training','Staff briefing and training','Induction, supervision and refresher briefing')}{field('records','Records and confidentiality','Illness reports, decisions, actions, advice and secure handling')}</section>
    <label className="field-label">Additional notes<textarea className="overview-notes" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Named deputy, contact details, local arrangements or review notes"/></label>
    <div className="overview-guidance"><b>Guidance to check</b><ul><li>Food handlers should tell the person in charge about illness that could contaminate food. Some conditions need specific advice or a longer exclusion.</li><li>For vomiting or diarrhoea, FSA guidance normally says staff should stay away from food handling until at least 48 hours after symptoms stop.</li><li>Cover cuts with a suitable brightly coloured waterproof dressing; gloves do not replace effective handwashing.</li></ul><p>Read the <a href="https://www.food.gov.uk/business-guidance/food-handlers-fitness-to-work" target="_blank" rel="noreferrer">Food Standards Agency fitness-to-work guidance</a>. Follow illness-specific advice from a health professional or local authority.</p></div>
    <details className="overview-preview"><summary>Show the policy that will be saved</summary><pre>{hygienePolicyMarkdown(value)}</pre></details>
  </div>
}

function TrainingRecordsEditor({ value, onChange }: { value: TrainingRecordsForm; onChange: (value: TrainingRecordsForm) => void }) {
  const update = (index: number, key: keyof TrainingRecord, next: string) => onChange({ ...value, records: value.records.map((record, i) => i === index ? { ...record, [key]: next } : record) })
  return <div className="overview-form training-record-form">
    <div className="overview-form-intro"><b>Food safety training records</b><p>Keep a record for each staff member and each relevant training or briefing. Include induction and role-specific topics, and note any supervision or further support needed.</p></div>
    <div className="temperature-check-list"><div className="temperature-check-list-heading"><div><h3>Staff training log</h3><p>Record actual training dates and where evidence is kept. Add another row for each topic or session.</p></div><button className="button secondary" type="button" onClick={() => onChange({ ...value, records: [...value.records, blankTrainingRecord()] })}><Plus size={16}/>Add training record</button></div>
      {value.records.map((record, index) => <section className="temperature-check-card training-record-card" key={index}><div className="temperature-check-card-heading"><b>Training record {index + 1}</b>{value.records.length > 1 && <button className="text-link temperature-remove" type="button" onClick={() => onChange({ ...value, records: value.records.filter((_, i) => i !== index) })}>Remove</button>}</div>
        <div className="training-record-grid">
          <label className="field-label">Staff member<input value={record.staffMember} onChange={e => update(index, 'staffMember', e.target.value)} placeholder="Full name"/></label>
          <label className="field-label">Role<select value={record.role} onChange={e => update(index, 'role', e.target.value)}><option value="">Choose role</option><option>Owner / manager</option><option>Supervisor / person in charge</option><option>Food handler</option><option>Temporary / agency staff</option><option>Other</option></select></label>
          <label className="field-label">Training / instruction<select value={record.training} onChange={e => update(index, 'training', e.target.value)}><option value="">Choose topic</option><option>Food safety induction</option><option>Personal hygiene and illness reporting</option><option>Handwashing</option><option>Cross-contamination prevention</option><option>Allergen awareness and procedures</option><option>Temperature checks and probe use</option><option>Cleaning and disinfection</option><option>Safe food storage and stock rotation</option><option>Food preparation, cooking and reheating</option><option>Pest, waste and water procedures</option><option>Safe equipment use</option><option>Emergency and incident reporting</option><option>Refresher briefing</option><option>Other</option></select></label>
          <label className="field-label">Training status<select value={record.status} onChange={e => update(index, 'status', e.target.value)}><option>Not recorded</option><option>Planned</option><option>In progress</option><option>Completed</option><option>Refresher due</option><option>Further support required</option></select></label>
          <label className="field-label">Date completed<input type="date" value={record.dateCompleted} onChange={e => update(index, 'dateCompleted', e.target.value)}/></label>
          <label className="field-label">Trainer / provider<input value={record.trainer} onChange={e => update(index, 'trainer', e.target.value)} placeholder="Name, organisation or course provider"/></label>
          <label className="field-label">Evidence / certificate location<input value={record.evidence} onChange={e => update(index, 'evidence', e.target.value)} placeholder="File name, folder or certificate reference"/></label>
          <label className="field-label">Refresher due<input type="date" value={record.refresherDue} onChange={e => update(index, 'refresherDue', e.target.value)}/></label>
          <label className="field-label training-record-wide">Additional support / supervision needed<textarea value={record.support} onChange={e => update(index, 'support', e.target.value)} placeholder="Topics to revisit, supervision or follow-up actions; leave blank if none identified"/></label>
          <label className="field-label training-record-wide">Staff acknowledgement / signature<input value={record.acknowledgement} onChange={e => update(index, 'acknowledgement', e.target.value)} placeholder="Name / initials and date, or signature reference"/></label>
        </div>
      </section>)}
    </div>
    <label className="field-label">Additional notes<textarea className="overview-notes" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Training arrangements, group briefings or review notes"/></label>
    <div className="overview-guidance"><b>Keep the record useful</b><ul><li>Match training to the food-handling tasks and responsibilities each person actually performs.</li><li>Use the status accurately. Enter a completion date only after the training or briefing has taken place.</li><li>Keep certificates or other evidence and record where they can be found.</li><li>Plan refreshers or extra supervision when needed and review after procedures, duties or equipment change.</li></ul><p>This log records instruction and follow-up; it does not by itself certify a person's competence.</p></div>
    <details className="overview-preview"><summary>Show the records that will be saved</summary><pre>{trainingRecordsMarkdown(value)}</pre></details>
  </div>
}

function DocumentReviewEditor({ value, onChange }: { value: DocumentReviewForm; onChange: (value: DocumentReviewForm) => void }) {
  const update = (index: number, key: keyof DocumentReviewRecord, next: string) => onChange({ ...value, records: value.records.map((record, i) => i === index ? { ...record, [key]: next } : record) })
  return <div className="overview-form document-review-form">
    <div className="overview-form-intro"><b>Document review and update log</b><p>Record when each food safety document is reviewed, why it was checked, what changed and who was briefed. Keep one entry per document review.</p></div>
    <div className="temperature-check-list"><div className="temperature-check-list-heading"><div><h3>Review and update log</h3><p>Record a review even when the document remains unchanged, then set its next review date.</p></div><button className="button secondary" type="button" onClick={() => onChange({ ...value, records: [...value.records, blankDocumentReviewRecord()] })}><Plus size={16}/>Add review</button></div>
      {value.records.map((record, index) => <section className="temperature-check-card document-review-card" key={index}><div className="temperature-check-card-heading"><b>Review {index + 1}</b>{value.records.length > 1 && <button className="text-link temperature-remove" type="button" onClick={() => onChange({ ...value, records: value.records.filter((_, i) => i !== index) })}>Remove</button>}</div>
        <div className="document-review-grid">
          <label className="field-label">Document / procedure<input value={record.document} onChange={e => update(index, 'document', e.target.value)} placeholder="e.g. Allergen management policy"/></label>
          <label className="field-label">Version / reference<input value={record.version} onChange={e => update(index, 'version', e.target.value)} placeholder="Version number or document reference"/></label>
          <label className="field-label">Review date<input type="date" value={record.reviewDate} onChange={e => update(index, 'reviewDate', e.target.value)}/></label>
          <label className="field-label">Reason for review<select value={record.reason} onChange={e => update(index, 'reason', e.target.value)}><option value="">Choose reason</option><option>Scheduled review</option><option>Menu, recipe or ingredient change</option><option>Supplier change</option><option>Equipment, premises or layout change</option><option>Water or utility change</option><option>Staff role or responsibility change</option><option>Incident or corrective action</option><option>Guidance or legal update</option><option>Other</option></select></label>
          <label className="field-label">Review outcome<select value={record.outcome} onChange={e => update(index, 'outcome', e.target.value)}><option>Not recorded</option><option>No change required</option><option>Updated</option><option>Replaced</option><option>Further action required</option></select></label>
          <label className="field-label">Reviewed by<input value={record.reviewedBy} onChange={e => update(index, 'reviewedBy', e.target.value)} placeholder="Name / role"/></label>
          <label className="field-label document-review-wide">Changes made / action required<textarea value={record.changes} onChange={e => update(index, 'changes', e.target.value)} placeholder="Summarise the change or note that no change was needed"/></label>
          <label className="field-label">Staff briefed date<input type="date" value={record.staffBriefedDate} onChange={e => update(index, 'staffBriefedDate', e.target.value)}/></label>
          <label className="field-label">Next review date<input type="date" value={record.nextReviewDate} onChange={e => update(index, 'nextReviewDate', e.target.value)}/></label>
          <label className="field-label document-review-wide">Superseded version / storage location<input value={record.supersededReference} onChange={e => update(index, 'supersededReference', e.target.value)} placeholder="Where old copy is marked or archived; leave blank if not applicable"/></label>
        </div>
      </section>)}
    </div>
    <label className="field-label">Additional notes<textarea className="overview-notes" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Review arrangements, outstanding actions or references"/></label>
    <div className="overview-guidance"><b>When to review</b><ul><li>Review after changes to the menu, recipes, suppliers, equipment, premises, water arrangements, staff responsibilities or working practices.</li><li>Review after incidents, corrective actions or relevant official guidance changes.</li><li>Brief affected staff on updated procedures and record the briefing date.</li><li>Clearly identify the current version and mark superseded copies to prevent accidental use.</li></ul></div>
    <details className="overview-preview"><summary>Show the log that will be saved</summary><pre>{documentReviewMarkdown(value)}</pre></details>
  </div>
}

function PestWasteWaterEditor({ value, onChange }: { value: PestWasteWaterForm; onChange: (value: PestWasteWaterForm) => void }) {
  const update = (index: number, key: keyof PestWasteWaterRecord, next: string) => onChange({ ...value, records: value.records.map((record, i) => i === index ? { ...record, [key]: next } : record) })
  return <div className="overview-form pest-water-record-form">
    <div className="overview-form-intro"><b>Pest control, waste and water safety records</b><p>Record routine checks, pest activity, waste issues and water-system servicing. Add a separate entry for each check or event.</p></div>
    <div className="temperature-check-list"><div className="temperature-check-list-heading"><div><h3>Checks and service log</h3><p>Use the relevant water fields for water checks. Record actual findings, actions and follow-up.</p></div><button className="button secondary" type="button" onClick={() => onChange({ ...value, records: [...value.records, blankPestWasteWaterRecord()] })}><Plus size={16}/>Add record</button></div>
      {value.records.map((record, index) => <section className="temperature-check-card pest-water-record-card" key={index}><div className="temperature-check-card-heading"><b>Record {index + 1}</b>{value.records.length > 1 && <button className="text-link temperature-remove" type="button" onClick={() => onChange({ ...value, records: value.records.filter((_, i) => i !== index) })}>Remove</button>}</div>
        <div className="pest-water-record-grid">
          <label className="field-label">Date<input type="date" value={record.date} onChange={e => update(index, 'date', e.target.value)}/></label>
          <label className="field-label">Record type<select value={record.recordType} onChange={e => update(index, 'recordType', e.target.value)}><option value="">Choose record type</option><option>Routine pest inspection</option><option>Pest sighting / treatment visit</option><option>Waste storage / removal check</option><option>Waste collection / disposal</option><option>Water supply / potability check</option><option>Fresh-water tank cleaning / disinfection</option><option>Water-system fault / corrective action</option><option>Other</option></select></label>
          <label className="field-label">Location / system<input value={record.location} onChange={e => update(index, 'location', e.target.value)} placeholder="Area, bin, water tank or equipment"/></label>
          <label className="field-label">Check status<select value={record.status} onChange={e => update(index, 'status', e.target.value)}><option>Not checked</option><option>Satisfactory</option><option>Action required</option><option>Follow-up due</option><option>Completed / verified</option><option>Not applicable</option></select></label>
          <label className="field-label pest-water-wide">Findings / condition<textarea value={record.findings} onChange={e => update(index, 'findings', e.target.value)} placeholder="Pest signs, waste condition, water check or service findings"/></label>
          <label className="field-label pest-water-wide">Action / service details<textarea value={record.action} onChange={e => update(index, 'action', e.target.value)} placeholder="Cleaning, waste removal, pest contractor treatment, repair or other action; include service details"/></label>
          <label className="field-label">Water source<input value={record.waterSource} onChange={e => update(index, 'waterSource', e.target.value)} placeholder="Fresh-water tank, mains supply or other"/></label>
          <label className="field-label">Potable water confirmed<select value={record.potable} onChange={e => update(index, 'potable', e.target.value)}><option>Not checked</option><option>Yes</option><option>No — do not use</option><option>Not applicable</option></select></label>
          <label className="field-label">Tank cleaning / disinfection / refill<textarea value={record.tankService} onChange={e => update(index, 'tankService', e.target.value)} placeholder="Date, method / product and service details where applicable"/></label>
          <label className="field-label">Fresh / wastewater separation<select value={record.separationCheck} onChange={e => update(index, 'separationCheck', e.target.value)}><option>Not checked</option><option>Confirmed separate and protected</option><option>Issue found — action recorded</option><option>Not applicable</option></select></label>
          <label className="field-label">Person responsible<input value={record.responsible} onChange={e => update(index, 'responsible', e.target.value)} placeholder="Name or role"/></label>
          <label className="field-label">Follow-up date<input type="date" value={record.followUpDate} onChange={e => update(index, 'followUpDate', e.target.value)}/></label>
          <label className="field-label">Verified by<input value={record.verifiedBy} onChange={e => update(index, 'verifiedBy', e.target.value)} placeholder="Name or initials"/></label>
        </div>
      </section>)}
    </div>
    <label className="field-label">Additional notes<textarea className="overview-notes" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Contractor details, waste collection references, local water arrangements or review notes"/></label>
    <div className="overview-guidance"><b>Safe checks to include</b><ul><li>Look for pest signs, protect food and food-contact equipment, control access points where practical, and record treatment and follow-up.</li><li>Keep waste in suitable containers, remove it frequently and prevent it contaminating food, clean equipment or water points.</li><li>Use potable water for food handling and handwashing. If safety is uncertain, stop using it for those purposes until resolved.</li><li>For tanks, record cleaning and disinfection as applicable, protect the fresh-water system, and keep fresh water separate from wastewater.</li></ul><p>Adapt the schedule to the actual premises and water system, and follow current local authority and supplier instructions.</p></div>
    <details className="overview-preview"><summary>Show the records that will be saved</summary><pre>{pestWasteWaterMarkdown(value)}</pre></details>
  </div>
}function FoodProcessEditor({ value, onChange }: { value: FoodProcessForm; onChange: (value: FoodProcessForm) => void }) {
  const step = (key: 'preparation' | 'cooking' | 'cooling' | 'reheating', title: string, description: string) => {
    const item = value[key]
    const update = (field: keyof FoodProcessStep, next: string) => onChange({ ...value, [key]: { ...item, [field]: next } })
    return <section className="food-process-section" key={key}><div><h3>{title}</h3><p>{description}</p></div>
      <label className="field-label">Method and equipment<textarea value={item.method} onChange={e => update('method', e.target.value)} placeholder="Describe the method used for the actual foods and equipment"/></label>
      <label className="field-label">Critical limit / acceptance criteria<textarea value={item.limit} onChange={e => update('limit', e.target.value)} placeholder="Set a product-specific limit from current official guidance or validated procedure"/></label>
      <label className="field-label">Monitoring and records<textarea value={item.monitoring} onChange={e => update('monitoring', e.target.value)} placeholder="Who checks, how, when, and which log is completed"/></label>
      <label className="field-label">Corrective action<textarea value={item.correctiveAction} onChange={e => update('correctiveAction', e.target.value)} placeholder="What staff do if the check fails or the process is interrupted"/></label>
    </section>
  }
  return <div className="overview-form food-process-form">
    <div className="overview-form-intro"><b>Food preparation, cooking, cooling and reheating procedures</b><p>Write down the methods your team actually uses. Set process limits to match each food and your equipment; keep monitoring records with the relevant checks.</p></div>
    <div className="overview-form-grid food-process-meta"><label className="field-label">Business<input value={value.business} onChange={e => onChange({ ...value, business: e.target.value })}/></label><label className="field-label">Responsible person<input value={value.responsible} onChange={e => onChange({ ...value, responsible: e.target.value })} placeholder="Name or role"/></label><label className="field-label">Review date<input type="date" value={value.reviewDate} onChange={e => onChange({ ...value, reviewDate: e.target.value })}/></label></div>
    {step('preparation','Preparation','Hygiene, raw / ready-to-eat separation, thawing, batch size and mise en place.')}
    {step('cooking','Cooking','Cooking method, target time and core temperature, probe checks and safe batch handling.')}
    {step('cooling','Cooling','How food is portioned, cooled and moved into chilled storage; include your defined time and temperature limits.')}
    {step('reheating','Reheating','Equipment, batch size, stirring / standing where relevant, checks and service or hot-holding handoff.')}
    <label className="field-label">Additional notes<textarea className="overview-notes" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Food groups covered, training notes or links to related records"/></label>
    <div className="overview-guidance"><b>Procedure checks</b><ul><li>Use separate or fully cleaned equipment for raw and ready-to-eat foods, and clean and disinfect probes between checks.</li><li>Food Standards Agency cooking guidance gives 70°C for 2 minutes at the centre, or specified equivalent combinations. Confirm the method is suitable for the food and process.</li><li>Cool food promptly using a method and time limit suited to your operation. Record the real cooling check and action if the limit is missed.</li><li>Reheat until steaming hot throughout, only once, and serve promptly unless transferring directly to hot holding.</li></ul><p>See <a href="https://www.food.gov.uk/safety-hygiene/cooking-your-food" target="_blank" rel="noreferrer">Food Standards Agency cooking guidance</a> and your applicable Safer Food Better Business pack.</p></div>
    <details className="overview-preview"><summary>Show the procedure that will be saved</summary><pre>{foodProcessMarkdown(value)}</pre></details>
  </div>
}

function StorageRotationEditor({ value, onChange }: { value: StorageRotationForm; onChange: (value: StorageRotationForm) => void }) {
  const update = (index: number, key: keyof StorageRotationRecord, next: string) => onChange({ ...value, records: value.records.map((row, i) => i === index ? { ...row, [key]: next } : row) })
  return <div className="overview-form storage-rotation-form">
    <div className="overview-form-intro"><b>Food storage and stock rotation records</b><p>Record the products you check, where they are stored, relevant date codes, rotation and any discard action.</p></div>
    <div className="overview-form-grid"><label className="field-label">Check date<input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })}/></label></div>
    <div className="temperature-check-list"><div className="temperature-check-list-heading"><div><h3>Stock checks</h3><p>Add one row per product, batch or storage check.</p></div><button className="button secondary" type="button" onClick={() => onChange({ ...value, records: [...value.records, blankStorageRotationRecord()] })}><Plus size={16}/>Add product</button></div>
      {value.records.map((row, index) => <section className="temperature-check-card storage-rotation-card" key={index}><div className="temperature-check-card-heading"><b>Product {index + 1}</b>{value.records.length > 1 && <button className="text-link temperature-remove" type="button" onClick={() => onChange({ ...value, records: value.records.filter((_, i) => i !== index) })}>Remove</button>}</div>
        <div className="storage-rotation-grid">
          <label className="field-label">Product<input value={row.product} onChange={e => update(index, 'product', e.target.value)} placeholder="Food / ingredient"/></label>
          <label className="field-label">Batch / use-by date<input value={row.batchUseBy} onChange={e => update(index, 'batchUseBy', e.target.value)} placeholder="Batch / lot code and use-by or best-before date"/></label>
          <label className="field-label">Storage location<input value={row.location} onChange={e => update(index, 'location', e.target.value)} placeholder="e.g. labelled fridge shelf, freezer"/></label>
          <label className="field-label">Date opened / prepared<input type="date" value={row.openedPrepared} onChange={e => update(index, 'openedPrepared', e.target.value)}/></label>
          <label className="field-label">Rotation check<select value={row.rotation} onChange={e => update(index, 'rotation', e.target.value)}><option>Not checked</option><option>In date — rotate stock</option><option>Use first</option><option>Past use-by — isolate</option><option>Discarded</option><option>Other action needed</option></select></label>
          <label className="field-label">Discard date / action<input value={row.discardAction} onChange={e => update(index, 'discardAction', e.target.value)} placeholder="Date and what was discarded / follow-up"/></label>
          <label className="field-label">Initials<input value={row.initials} onChange={e => update(index, 'initials', e.target.value)} placeholder="Person completing the check"/></label>
        </div>
      </section>)}
    </div>
    <label className="field-label">Additional notes<textarea className="overview-notes" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Local storage rules, follow-up or record location"/></label>
    <div className="overview-guidance"><b>Storage and rotation</b><ul><li>Keep food covered, labelled and stored under conditions suitable for the product; separate raw food from ready-to-eat food and chemicals from food.</li><li>Follow the product's use-by date and after-opening instructions. Do not rely on smell or appearance to override a use-by date.</li><li>Rotate older suitable stock first. Mark products that need checking, isolation or disposal and record the action.</li><li>Use actual batch and date details; complete records when checked and do not backdate.</li></ul></div>
    <details className="overview-preview"><summary>Show the record that will be saved</summary><pre>{storageRotationMarkdown(value)}</pre></details>
  </div>
}

function CleaningRecordEditor({ value, onChange }: { value: CleaningRecordForm; onChange: (value: CleaningRecordForm) => void }) {
  const update = (index: number, key: keyof CleaningRecord, next: string) => onChange({ ...value, records: value.records.map((row, i) => i === index ? { ...row, [key]: next } : row) })
  return <div className="overview-form cleaning-record-form">
    <div className="overview-form-intro"><b>Cleaning and disinfection schedule and records</b><p>Set out the task, product, method and frequency for your operation. Record completion and any issue when the work is done.</p></div>
    <div className="overview-form-grid"><label className="field-label">Date<input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })}/></label></div>
    <div className="temperature-check-list"><div className="temperature-check-list-heading"><div><h3>Schedule and completion record</h3><p>Add a row for each area, item or cleaning task.</p></div><button className="button secondary" type="button" onClick={() => onChange({ ...value, records: [...value.records, blankCleaningRecord()] })}><Plus size={16}/>Add task</button></div>
      {value.records.map((row, index) => <section className="temperature-check-card cleaning-record-card" key={index}><div className="temperature-check-card-heading"><b>Task {index + 1}</b>{value.records.length > 1 && <button className="text-link temperature-remove" type="button" onClick={() => onChange({ ...value, records: value.records.filter((_, i) => i !== index) })}>Remove</button>}</div>
        <div className="cleaning-record-grid">
          <label className="field-label">Area / item<input value={row.area} onChange={e => update(index, 'area', e.target.value)} placeholder="e.g. food prep bench, fridge handle"/></label>
          <label className="field-label">Product and dilution<input value={row.product} onChange={e => update(index, 'product', e.target.value)} placeholder="Product and label dilution"/></label>
          <label className="field-label">Method / contact time<textarea value={row.method} onChange={e => update(index, 'method', e.target.value)} placeholder="Clean first; record method and label contact time"/></label>
          <label className="field-label">Frequency<select value={row.frequency} onChange={e => update(index, 'frequency', e.target.value)}><option value="">Choose frequency</option><option>Before and after use</option><option>After each service</option><option>Daily</option><option>Weekly</option><option>As needed</option><option>Other — see notes</option></select></label>
          <label className="field-label">Status<select value={row.status} onChange={e => update(index, 'status', e.target.value)}><option>Not done</option><option>Complete</option><option>Issue found</option><option>Not applicable</option></select></label>
          <label className="field-label">Completed by<input value={row.completedBy} onChange={e => update(index, 'completedBy', e.target.value)} placeholder="Name or initials"/></label>
          <label className="field-label">Checked by<input value={row.checkedBy} onChange={e => update(index, 'checkedBy', e.target.value)} placeholder="Name or initials"/></label>
          <label className="field-label cleaning-issue-field">Issue / action<textarea value={row.issue} onChange={e => update(index, 'issue', e.target.value)} placeholder="Problem found and corrective action, if any"/></label>
        </div>
      </section>)}
    </div>
    <label className="field-label">Additional notes<textarea className="overview-notes" value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} placeholder="Local tasks, follow-up or review notes"/></label>
    <div className="overview-guidance"><b>Safe cleaning records</b><ul><li>Include food-contact surfaces, utensils, cooker/fryer, fridge handles and shelves, sinks, floors, bins and other relevant touchpoints.</li><li>Remove visible soil first, then disinfect food-contact surfaces with a suitable product. Follow the label dilution, application and contact time.</li><li>Keep chemicals away from food and utensils. Mark a task complete only after it has been done.</li><li>Record issues and actions at the time; adapt the schedule and frequencies to your actual operation.</li></ul></div>
    <details className="overview-preview"><summary>Show the record that will be saved</summary><pre>{cleaningRecordMarkdown(value)}</pre></details>
  </div>
}

function OpeningClosingEditor({ value, onChange }: { value: OpeningClosingForm; onChange: (value: OpeningClosingForm) => void }) {
  const updateItem = (group: 'opening' | 'closing', index: number, key: keyof OpeningClosingItem, next: string) => onChange({ ...value, [group]: value[group].map((item, i) => i === index ? { ...item, [key]: next } : item) })
  const renderGroup = (group: 'opening' | 'closing', title: string, items: OpeningClosingItem[]) => <section className="opening-check-section"><div className="temperature-check-list-heading"><div><h3>{title}</h3><p>Choose the status for each check and record any local action.</p></div><button className="button secondary" type="button" onClick={() => onChange({ ...value, [group]: [...value[group], { label: '', status: 'Not checked', action: '' }] })}><Plus size={16}/>Add item</button></div>
    <div className="opening-check-list">{items.map((item, index) => <div className="opening-check-row" key={`${group}-${index}`}>
      <label className="field-label opening-check-label">Check<input value={item.label} onChange={e => updateItem(group, index, 'label', e.target.value)} placeholder="Describe the check"/></label>
      <label className="field-label">Status<select value={item.status} onChange={e => updateItem(group, index, 'status', e.target.value)}><option>Not checked</option><option>Complete</option><option>Issue found</option><option>Not applicable</option></select></label>
      <label className="field-label opening-check-action">Notes / action<textarea value={item.action} onChange={e => updateItem(group, index, 'action', e.target.value)} placeholder="Optional details or action taken"/></label>
      {items.length > 1 && <button className="text-link opening-remove" type="button" onClick={() => onChange({ ...value, [group]: value[group].filter((_, i) => i !== index) })}>Remove</button>}
    </div>)}</div>
  </section>
  return <div className="overview-form opening-closing-form">
    <div className="overview-form-intro"><b>Daily opening and closing checks</b><p>Record what was actually checked. If something is incomplete or unsafe, note the issue and action taken before service or closing down.</p></div>
    <div className="overview-form-grid">
      <label className="field-label">Date<input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })}/></label>
      <label className="field-label">Person responsible<input value={value.responsible} onChange={e => onChange({ ...value, responsible: e.target.value })} placeholder="Name or initials"/></label>
    </div>
    {renderGroup('opening', 'Opening checks', value.opening)}
    {renderGroup('closing', 'Closing checks', value.closing)}
    <section className="opening-issue-section"><h3>Issues and corrective action</h3>
      <label className="field-label">Issue<textarea value={value.issue} onChange={e => onChange({ ...value, issue: e.target.value })} placeholder="Describe any problem found; leave blank if none"/></label>
      <label className="field-label">Action taken<textarea value={value.action} onChange={e => onChange({ ...value, action: e.target.value })} placeholder="What was done, and who was informed?"/></label>
      <label className="field-label">Follow-up required<textarea value={value.followUp} onChange={e => onChange({ ...value, followUp: e.target.value })} placeholder="What remains to be done, by whom, and when?"/></label>
    </section>
    <div className="overview-guidance"><b>Before service / after closing</b><ul><li>Mark checks complete only after they have been done.</li><li>Record issues and practical corrective actions at the time; do not leave unsafe conditions unresolved.</li><li>Follow the separate food safety procedures for temperature, allergens, cleaning, equipment and illness.</li></ul></div>
    <details className="overview-preview"><summary>Show the record that will be saved</summary><pre>{openingClosingMarkdown(value)}</pre></details>
  </div>
}

function DocumentRow({ doc, onOpen, onExport }: { doc: Doc; onOpen: (doc: Doc) => void; onExport: (doc: Doc) => void }) {
  return <div className="document-row"><button className={`doc-type-icon ${doc.type === 'record' ? 'doc-type-gold' : ''}`} onClick={() => doc.type === 'file' ? undefined : onOpen(doc)} aria-label={`Open ${doc.title}`}><FileText size={18}/></button><button className="doc-row-main" onClick={() => doc.type === 'file' ? undefined : onOpen(doc)}><b>{doc.title}</b><span>{doc.category} <i>•</i> {prettyDate(doc.updatedAt)}</span></button><button className="icon-button row-export" onClick={() => onExport(doc)} aria-label={`Export ${doc.title}`}><ArrowDownToLine size={17}/></button><button className="icon-button row-open" onClick={() => doc.type === 'file' ? undefined : onOpen(doc)} aria-label={`Edit ${doc.title}`}><ChevronRight size={18}/></button></div>
}
function EmptyState({ title, text }: { title: string; text: string }) { return <div className="empty-state"><div><Folder size={22}/></div><b>{title}</b><p>{text}</p></div> }






