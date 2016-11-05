import DomainPurchaseService from './DomainPurchaseService';
import NamecheapServices from './NamecheapServices';
import ScalingoServices from './ScalingoServices';
import BraintreeServices from './BraintreeServices';

export default {
	startNextStep(domain, siteId){
		log.debug("DomainPurchaseService startNextStep", {domain, siteId});

		// What action comes after current step?
		const stepsActions = {
			checkAvailability: () => NamecheapServices.getAvailability(domain, siteId),
			checkAvailabilityAvailable: () => log.warn("Ask for credit card"),
			clientTokenStart: () => log.error("This step doesn't have a next: clientTokenStart"),
			clientTokenSent: () => log.error("This step doesn't have a next: clientTokenSent"),
			noncePaymentStart: () => log.error("This step doesn't have a next: noncePaymentStart"),
			noncePaymentDone: () => log.error("This step doesn't have a next: noncePaymentDone"),
			confirmPaymentStart: () => log.error("This step doesn't have a next: confirmPaymentStart"),
			confirmPaymentDone: () => log.error("This step doesn't have a next: confirmPaymentDone"),
			buyDomainStart: () => log.error("This step doesn't have a next: buyDomainStart"),
			buyDomainDone: () => log.error("This step doesn't have a next: buyDomainDone"),
			setHostsStart: () => log.error("This step doesn't have a next: setHostsStart"),
			setHostsDone: () => log.error("This step doesn't have a next: setHostsDone"),
			setScalingoRouteStart: () => log.error("This step doesn't have a next: setScalingoRouteStart"),
			setScalingoRouteDone: () => log.error("This step doesn't have a next: setScalingoRouteDone"),
			// All of the show stoppers are at the end
			checkAvailabilityError: () => {this.tryStepAgain(domain, siteId, ['checkAvailabilityError', 'checkAvailabilityStarted'])},
			error: () => log.error("This step doesn't have a next: error"),
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
		DomainPurchasesCollection.update({domain, siteId}, {$pullAll: {steps: arr}});
		this.startNextStep(domain, siteId);
	}
}

Meteor.methods({
	'DomainPurchases.startNextStep'(domain, siteId) {
		DomainPurchaseService.startNextStep(domain, siteId);
	}
})