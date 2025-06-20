import * as readline from "readline";
import { Contact } from "./Contact";
import { AddressBookMain } from "./addressBook";

export class AddressBookSystem {
    private addressBooks: { [key: string]: AddressBookMain } = {};
    private currentBookName: string | null = null;

    public rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    constructor() {
        this.showWelcome();
    }

    private showWelcome() {
        console.log("Welcome to the Address Book System");
        this.selectOrCreateAddressBook();
    }

    private selectOrCreateAddressBook() {
        console.log(`
            Press 1 for Create a new Address Book
            Press 2 Select existing Address Book
            Press 3 for Search Person by city or state
            Press 4 for exit
            Press 5 Save Address Book to File
            Press 6 Load Address Book from File
            Press 7 Save Address Book to CSV
            press 8 Load Address Book from CSV
        `);

        this.rl.question("Enter Your Choice: ", (choice) => {
            switch (choice.trim()) {
                case '1':
                    this.createNewAddressBook();
                    break;
                case '2':
                    this.selectExistingAddressBook();
                    break;
                case "3":
                    this.searchPersonByCityOrState();
                    break;
                case "4":
                    this.exitSystem();
                    break;
                case "5":
                    this.saveAddressBookToFile();
                    break;
                case "6":
                    this.loadAddressBookFromFile();
                    break;
                case "7":
                    this.saveAddressBookToCSV();
                    break;
                case "8":
                    this.loadAddressBookFromCSV();
                    break;

                default:
                    console.log("Invalid Input")
                    this.selectOrCreateAddressBook();
                    break;
            }
        })
    }

    private createNewAddressBook(): void {
        this.rl.question("Enter the name of AddressBook: ", (bookName) => {
            if (this.addressBooks[bookName]) {
                console.log("Address Book already exist")
            }
            else {
                this.addressBooks[bookName] = new AddressBookMain(this.rl, () => this.selectOrCreateAddressBook());
                this.currentBookName = bookName;
                console.log(`created or switched to ${bookName} AddressBook`)
                this.addressBooks[bookName].displayAddressBook();
            }
        })
    }

    private selectExistingAddressBook(): void {
        const bookNames = Object.keys(this.addressBooks);

        //check the existence of the address book
        if (bookNames.length === 0) {
            console.log("AddressBook Not exists")
            this.selectOrCreateAddressBook();
            return;
        }

        //addressbook exists and list all the books
        bookNames.forEach((item, index) => console.log(`${index + 1} - ${item}`))

        //take input for the address book
        this.rl.question("Enter the address book name: ", (bookName) => {
            if (this.addressBooks[bookName]) {
                this.currentBookName = bookName;
                console.log(`You have selected ${bookName} addressbook`)
                this.addressBooks[bookName].displayAddressBook();
            }
            else {
                console.log("address book not found")
                this.selectOrCreateAddressBook();
            }
        })

    }

    private searchPersonByCityOrState(): void {
        this.rl.question("Enter City or State to search: ", (input) => {
            const keyword = input.trim().toLowerCase();
            let found = false;

            for (const [bookName, addressBook] of Object.entries(this.addressBooks)) {
                const results = addressBook.searchByCityOrState(keyword);
                if (results.length > 0) {
                    found = true;
                    console.log(`\nAddress Book: ${bookName}`);
                    results.forEach((contact, i) => {
                        console.log(`\n#${i + 1}`);
                        contact.displayContact();
                    });
                }
            }

            if (!found) {
                console.log("No contacts found in any address book for given city/state.");
            }
            this.selectOrCreateAddressBook();
        });
    }

    private exitSystem(): void {
        console.log("Exiting...");
        this.rl.close();
    }

    private saveAddressBookToFile(): void {
        if (this.currentBookName && this.addressBooks[this.currentBookName]) {
            this.addressBooks[this.currentBookName].saveToTextFile(this.currentBookName);
        } else {
            console.log("No address book selected.");
            this.selectOrCreateAddressBook();
        }
    }

    private loadAddressBookFromFile(): void {
        this.rl.question("Enter the name of the Address Book to load from file: ", (bookName) => {
            if (!this.addressBooks[bookName]) {
                this.addressBooks[bookName] = new AddressBookMain(this.rl, () => this.selectOrCreateAddressBook());
            }
            this.currentBookName = bookName;
            this.addressBooks[bookName].loadFromTextFile(bookName);
        });
    }

    private saveAddressBookToCSV(): void{
         if (this.currentBookName && this.addressBooks[this.currentBookName]) {
            this.addressBooks[this.currentBookName].saveToCSVFile(this.currentBookName);
        } else {
            console.log("No address book selected.");
            this.selectOrCreateAddressBook();
        }
    }

    private loadAddressBookFromCSV() : void{
        this.rl.question("Enter the name of the Address Book to load from CSV: ", (bookName) => {
            if (!this.addressBooks[bookName]) {
                this.addressBooks[bookName] = new AddressBookMain(this.rl, () => this.selectOrCreateAddressBook());
            }
            this.currentBookName = bookName;
            this.addressBooks[bookName].loadFromCSVFile(bookName);
        });
    }
}

const addressBookSytem = new AddressBookSystem();