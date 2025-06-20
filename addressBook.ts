import { Contact } from "./Contact";
import * as readline from "readline";
import * as fs from 'fs';


type SortableField = "city" | "state" | "zip" | "firstname";  //this must be declare outside class as per typescript rule
export class AddressBookMain {

    //To store all contacts
    private contacts: Contact[] = []
    constructor(public rl: readline.Interface, private goBackToMainMenu: () => void) { }

    public displayAddressBook(): void {
        console.log("Welcome to Address Book");
        this.mainMenu();
    }

    private mainMenu(): void {
        console.log(`
            This is a Main Menu of the program
            Press 1 for Add contact
            Press 2 for Display contact
            Press 3 for Edit contact
            Press 4 for Delete contact
            Press 5 Back to Main Menu
            Press 6 for sort the contact by firstname
            Press 7 for sort the contact by city/state/zip
            `);

        this.rl.question("Choose any option : ", (answer) => {
            switch (answer.trim()) {
                case '1':
                    console.log(`You have selected ${answer} for Add contact`)
                    this.addContact();
                    break;
                case '2':
                    console.log(`You have selected ${answer} for Display contact`)
                    this.showAllContacts();
                    break;
                case '3':
                    console.log(`You have selected ${answer} for Edit contact`)
                    this.editContact();
                    break;
                case '4':
                    console.log(`You have selected ${answer} for Delete contact`)
                    this.deleteContact();
                    break;
                case '5':
                    console.log("Returning to main menu...\n");
                    this.goBackToMainMenu(); // FIXED: avoid new instance
                    break;
                case '6':
                    console.log(`You have selected ${answer} for sort contact by First Name`)
                    this.sortContactByName();
                    break;
                case '7':
                    console.log(`You have selected ${answer} for sort contact by city/state/zip`)
                    this.sortContactsByField();
                    break;
                default:
                    console.log(`invalid option`)
                    break;
            }
        });
    }

    private showAllContacts(): void {
        console.log(`You have entered ${this.contacts.length} contact`)
        this.contacts.forEach((contact, index) => {
            console.log(`\n#${index + 1}`);
            contact.displayContact();
        });
        this.mainMenu();
    }

    private addContact(): void {
        const questions: string[] = [
            "First Name : ",
            "Last Name : ",
            "Address : ",
            "City : ",
            "State : ",
            "Zip : ",
            "Phone :",
            "Email : "
        ]

        //To store all field of a single contact
        const answers: string[] = []
        const ask = (index: number) => {
            if (index === questions.length) {
                //array destructuring
                const [firstname, lastname, address, city, state, zip, phone, email] = answers;

                //duplicate entry check
                const duplicate = this.contacts.find(c =>
                    c.firstname.toLowerCase() === firstname.toLowerCase() &&
                    c.lastname.toLowerCase() === lastname.toLowerCase()
                );

                if (duplicate) {
                    console.log("Duplicate contact found. Cannot add the same person again.");
                }
                else {
                    //creating a contact
                    const contact = new Contact(firstname, lastname, address, city, state, zip, phone, email);
                    this.contacts.push(contact);
                    console.log("contact added succesfully")
                    contact.displayContact();
                }
                this.mainMenu();
                return;
            }

            this.rl.question(questions[index], (input) => {
                answers.push(input.trim());
                ask(index + 1);
            });
        };
        ask(0);
    }

    private editContact(): void {
        this.rl.question("Enter firstname of the person for edit : ", (name) => {
            const findContact = this.contacts.find((person) => person.firstname.toLowerCase() === name.trim().toLowerCase());
            console.log("findContact=  ", findContact);

            if (!findContact) {
                console.log("Contact not found.");
                this.mainMenu();
                return;
            }

            const fields: (keyof Contact)[] = [
                "firstname", "lastname", "address", "city",
                "state", "zip", "phone", "email"
            ];

            const askEdit = (i: number) => {
                if (i === fields.length) {
                    console.log("Contact updated.");
                    findContact.displayContact();
                    this.mainMenu();
                    return;
                }

                const field = fields[i];
                const oldValue = findContact[field];
                this.rl.question(`${field} (${oldValue}) : `, (userInput) => {
                    const trimmedInput = userInput.trim();
                    if (trimmedInput) {
                        (findContact as any)[field] = trimmedInput;
                    }
                    askEdit(i + 1); // Call next question only after current input
                });
            }
            askEdit(0);
        });
    }

    private deleteContact(): void {
        this.rl.question("Enter firstname of the person to delete: ", (name) => {
            const index = this.contacts.findIndex(
                (person) => person.firstname.toLowerCase() === name.trim().toLowerCase()
            );

            if (index === -1) {
                console.log("Contact not found.");
            } else {
                const deletedContact = this.contacts.splice(index, 1)[0];
                console.log("Contact deleted successfully:");
                deletedContact.displayContact();
            }

            this.mainMenu();
        });
    }

    public searchByCityOrState(keyword: string): Contact[] {
        return this.contacts.filter(contact =>
            contact.city.toLowerCase() === keyword || contact.state.toLowerCase() === keyword
        );
    }

    private sortContactByName(): void {
        if (this.contacts.length === 0) {
            console.log("No contact found for sorting")
        }
        else if (this.contacts.length === 1) {
            console.log("Only 1 contact is present , already sorted")
        }
        else {
            this.sortLogic("firstname")
        }
        return;
    }


    private sortContactsByField(): void {
        console.log(`
        Sort Contacts By:
        1. City
        2. State
        3. Zip
    `);

        this.rl.question("Choose sorting field (1-3): ", (choice) => {
            let field: SortableField;

            switch (choice.trim()) {
                case '1':
                    field = "city";
                    break;
                case '2':
                    field = "state";
                    break;
                case '3':
                    field = "zip";
                    break;
                default:
                    console.log("Invalid choice. Returning to menu...");
                    this.mainMenu();
                    return;
            }
            this.sortLogic(field);
        });
    }

    private sortLogic(field: SortableField): void {
        this.contacts.sort((a, b) =>
            a[field].toLowerCase().localeCompare(b[field].toLowerCase())
        );

        console.log(`Contacts sorted by ${field.charAt(0).toUpperCase() + field.slice(1)}:`);
        this.contacts.forEach((contact, index) => {
            console.log(`\n#${index + 1}`);
            contact.displayContact();
        });

        this.mainMenu();
    }

    public saveToTextFile(bookName: string): void {
        if (this.contacts.length === 0) {
            console.log(`No contacts to save in Address Book: ${bookName}`);
            this.mainMenu();
            return;
        }

        const filename = `${bookName}.txt`;
        let content = '';

        this.contacts.forEach((contact, index) => {
            content += `Contact ${index + 1}\n`;
            content += `First Name: ${contact.firstname}\n`;
            content += `Last Name: ${contact.lastname}\n`;
            content += `Address: ${contact.address}\n`;
            content += `City: ${contact.city}\n`;
            content += `State: ${contact.state}\n`;
            content += `Zip: ${contact.zip}\n`;
            content += `Phone: ${contact.phone}\n`;
            content += `Email: ${contact.email}\n`;
            content += `---\n`;
        });

        fs.writeFileSync(filename, content, 'utf8');
        console.log(`Contacts saved to file: ${filename}`);
        this.mainMenu();
    }

    public loadFromTextFile(bookName: string): void {
        const filename = `${bookName}.txt`;

        if (!fs.existsSync(filename)) {
            console.log(`File ${filename} not found. Cannot load contacts.`);
            this.mainMenu();
            return;
        }

        const data = fs.readFileSync(filename, 'utf8');
        const entries = data.split('---\n').filter(e => e.trim() !== '');

        this.contacts = entries.map(entry => {
            const lines = entry.split('\n');
            const firstName = lines.find(line => line.startsWith('First Name:')) || '';
            const lastName = lines.find(line => line.startsWith('Last Name:')) || '';
            const address = lines.find(line => line.startsWith('Address:')) || '';
            const city = lines.find(line => line.startsWith('City:')) || '';
            const state = lines.find(line => line.startsWith('State:')) || '';
            const zip = lines.find(line => line.startsWith('Zip:')) || '';
            const phone = lines.find(line => line.startsWith('Phone:')) || '';
            const email = lines.find(line => line.startsWith('Email:')) || '';

            return new Contact(
                firstName || '',
                lastName || '',
                address || '',
                city || '',
                state || '',
                zip || '',
                phone || '',
                email || ''
            );
        });

        console.log(`Contacts loaded into '${bookName}' from file: ${filename}`);
        this.mainMenu();
    }

    public saveToCSVFile(bookName: string): void {
        if (this.contacts.length === 0) {
            console.log(`No contacts to save in Address Book: ${bookName}`);
            this.mainMenu();
            return;
        }

        const filename = `${bookName}.csv`;
        const header = "FirstName, LastName, Address, City, State, Zip, Phone, Email\n";
        const row = this.contacts.map((value, index) => {
            return `${value.firstname},${value.lastname},${value.address},${value.city},${value.state},${value.zip},${value.phone},${value.email}`;
        });

        const data = header + row.join('\n');

        fs.writeFileSync(filename, data, 'utf8');
        console.log(`Contacts saved to file: ${filename}`);
        this.mainMenu();
    }

    public loadFromCSVFile(bookName: string): void {
        const filename = `${bookName}.csv`;

        if (!fs.existsSync(filename)) {
            console.log(`File ${filename} not found. Cannot load contacts.`);
            this.mainMenu();
            return;
        }

        const data = fs.readFileSync(filename, 'utf8');
        const lines = data.split('\n');

        //use slice for skipping header
        this.contacts = lines.slice(1).map(line => {
            const [firstname, lastname, address, city, state, zip, phone, email] = line.split(',');

            return new Contact(
                firstname?.trim() || "",
                lastname?.trim() || "",
                address?.trim() || "",
                city?.trim() || "",
                state?.trim() || "",
                zip?.trim() || "",
                phone?.trim() || "",
                email?.trim() || ""
            );
        });

        console.log(`Contacts loaded into '${bookName}' from CSV file: ${filename}`);
        this.mainMenu();
    }
}

