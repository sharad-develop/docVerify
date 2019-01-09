import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';


declare let require: any;
const docverify_artifacts = require('../../../build/contracts/Docverify.json');
var CryptoJS = require("crypto-js");

export interface UserType {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-doc-verify',
    templateUrl: './docverify.component.html',
    styleUrls: ['./docverify.component.css']
})
export class DocVerifyComponent implements OnInit {

    DocVerify: any;
    account: string;
    transactionHash: string;
    fileToUpload: File = null;
    fileHash: string;
    docStatus: string;
    requestTransactionDetails: string;
    verificationTransactionDetails: string;


    userTypes: UserType[] = [
        { value: "owner", viewValue: "Owner" },
        { value: "verifier", viewValue: "Verifier" },
        { value: "checker", viewValue: "Checker" }
    ]
    userType = "option1";
    docDiscoverable: any;


    constructor(private web3Service: Web3Service) {
       
    }

    ngOnInit(): void {

        this.loadAccount();
        this.loadContract();

    }

    loadContract(): void {

        this.web3Service.artifactsToContract(docverify_artifacts)
            .then((DocverifyAbstraction) => {
                this.DocVerify = DocverifyAbstraction;
            });

    }


    loadAccount() {
        this.web3Service.accountsObservable.subscribe((accounts) => {

            this.account = accounts[0];
            console.log("current account:" + this.account);

        });
    }

    /**
     * Parse uploaded file and caculate hash for that.
     * 
     * @param files 
     */
    handleFileInput(files: FileList) {
      
        this.fileToUpload = files.item(0);
        var reader = new FileReader();

        reader.onload = function (e) {
            var text = reader.result;
            var hash = CryptoJS.SHA256(text);
            document.getElementById('dochash').innerHTML = hash.toString();
        }

        reader.readAsText(this.fileToUpload);

    }

/**
 * Request doc verification
 */
    async requestDocVerification(address: HTMLInputElement, docHash: HTMLInputElement) {

        console.log("Request doc verification for doc:" + docHash.value + " verifier address:"+address.value+ "from: "+this.account);

        try {
            const deployedDocVerify = await this.DocVerify.deployed();
            const transaction = await deployedDocVerify.addDocToVerify
                .sendTransaction(address.value, docHash.value, this.docDiscoverable, { from: this.account, gas: 1000000 });

            if (!transaction) {
                this.requestTransactionDetails = 'Transaction failed!';
            } else {
                this.requestTransactionDetails = 'Transaction hash:'+transaction;
            }
        } catch (e) {

            console.log(e);

        }

    }

    /**
     * Verify document
     * @param address 
     * @param docHash 
     */
    async verifyDoc(address: HTMLInputElement, docHash: HTMLInputElement) {

        console.log("Verify document:"+docHash.value+" for :" + address.value);

        try {

            const deployedDocVerify = await this.DocVerify.deployed();
            const transaction = await deployedDocVerify.verifyDoc
                .sendTransaction(address.value, docHash.value, { from: this.account, gas: 1000000 });

            if (!transaction) {

                this.verificationTransactionDetails = 'Transaction failed!';

            } else {
               
                this.verificationTransactionDetails = 'Transaction: '+transaction;
            }
        } catch (e) {

            console.log(e);

        }

    }


    /**
     * Get document status
     * 
     * @param address 
     * @param docHash 
     */
    async getDocStatus(address: HTMLInputElement, docHash: HTMLInputElement) {
   
        const deployedDocVerify = await this.DocVerify.deployed();
        const transaction = await deployedDocVerify.getDocStatus.call(address.value, docHash.value);
        this.docStatus = transaction;
       

    }

    updateUser(): void {

        this.loadAccount();
    }


}
