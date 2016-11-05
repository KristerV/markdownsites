import DomainPurchaseService from './DomainPurchaseService';
import NamecheapServices from './NamecheapServices';
import ScalingoServices from './ScalingoServices';
import BraintreeServices from './BraintreeServices';

export default {
	startNextStep(domain, siteId){
		log.debug("DomainPurchaseService startNextStep", {domain, siteId});

		// What action comes after current step?
		const stepsActions = {

			// Process from start to finish
			checkAvailability: () => NamecheapServices.getAvailability(domain, siteId),
			noncePaymentDone: () => NamecheapServices.buyDomain(domain, siteId),
			buyDomainDone: () => NamecheapServices.setupDNS(domain, siteId),
			setHostsDone: () => ScalingoServices.setupRoute(domain, siteId),
			setScalingoRouteStart: () => log.error("This step doesn't have a next: setScalingoRouteStart"),
			setScalingoRouteDone: () => DomainPurchaseService.setStep(domain, siteId, 'complete'),

			// All of the show stoppers are at the end
			checkAvailabilityError: () => {this.tryStepAgain(domain, siteId, ['checkAvailabilityError', 'checkAvailabilityStarted'])},
			noncePaymentError: () => {this.tryStepAgain(domain, siteId, ['all'])},
			buyDomainError: () => {this.tryStepAgain(domain, siteId, ['buyDomainStart', 'buyDomainError'])},
			buyDomainWithoutTransactionError: () => {this.tryStepAgain(domain, siteId, ['all'])},
		};

		// Figure out next step
		let nextStep = 'checkAvailability';
		const item = DomainPurchasesCollection.findOne({domain, siteId});
		if (item && item.steps.length) {
			nextStep = item.steps[item.steps.length-1];
		}
		else if (!item) {
			DomainPurchasesCollection.insert({domain, siteId, steps: [], createdAt: new Date()})
		}

		if (!nextStep)
			log.error("Next step doesn't exist", {nextStep, domain, siteId});
		else
			log.info("DomainPurchaseService startNextStep is", {nextStep, domain, siteId});

		// Activate next step
		const nextAction = stepsActions[nextStep];
		if (nextAction)
			nextAction();
	},
	setStep(domain, siteId, stepName, details) {
		log.debug("DomainPurchaseService setStep", {domain, siteId, stepName, details});
		details = details || {};
		DomainPurchasesCollection.update({domain, siteId}, {$addToSet: {steps: stepName}, $set: {msg: details.msg, title: details.title}});
	},
	tryStepAgain(domain, siteId, arr) {
		if (arr.length === 1 && arr[0] == 'all')
			DomainPurchasesCollection.update({domain, siteId}, {$set: {steps: []}});
		else
			DomainPurchasesCollection.update({domain, siteId}, {$pullAll: {steps: arr}});
		this.startNextStep(domain, siteId);
	}
}

Meteor.methods({
	'DomainPurchases.startNextStep'(domain, siteId) {
		DomainPurchaseService.startNextStep(domain, siteId);
	}
})