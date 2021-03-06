import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { getPublishedRuns, getTestVersions } from '../../actions/runs';
import checkForConflict from '../../utils/checkForConflict';
import TestResult from '@components/TestResult';
import nextId from 'react-id-generator';

class RunResultsPage extends Component {
    async componentDidMount() {
        const { dispatch, run, testVersion } = this.props;
        if (!run) {
            dispatch(getPublishedRuns());
        }
        if (!testVersion) {
            dispatch(getTestVersions());
        }
    }

    renderResultRow(test, i) {
        const details = test.result.result.details;
        let required =
            details.summary[1].pass + details.summary[1].fail > 0
                ? `${details.summary[1].pass} / ${details.summary[1].fail +
                      details.summary[1].pass}`
                : '-';

        let optional =
            details.summary[2].pass + details.summary[2].fail > 0
                ? `${details.summary[2].pass} / ${details.summary[2].fail +
                      details.summary[1].pass}`
                : '-';

        return (
            <tr key={nextId()}>
                <td>
                    <a href={`#test-${i.toString()}`}>{details.name}</a>
                </td>
                <td>{required}</td>
                <td>{optional}</td>
                <td>{details.summary.unexpectedCount}</td>
            </tr>
        );
    }

    render() {
        const { run, allTests, testVersion } = this.props;

        if (!run || !allTests || !testVersion) {
            return <div>Loading</div>;
        }

        const {
            at_key,
            apg_example_name,
            at_name,
            at_version,
            browser_name,
            browser_version,
            run_status
        } = run;

        const { git_hash } = testVersion;

        let title = `Results for ${apg_example_name} tested with ${at_name} ${at_version} on ${browser_name} ${browser_version}`;
        if (!run_status) {
            return (
                <>
                    <Helmet>
                        <title>{title}</title>
                    </Helmet>
                    <Container fluid>
                        <Row>
                            <Col>
                                <Fragment>
                                    <h1>{title}</h1>
                                    <p>{`No results have been marked as DRAFT or FINAL for this run.`}</p>
                                </Fragment>
                            </Col>
                        </Row>
                    </Container>
                </>
            );
        }

        let tests = [];
        let skippedTests = [];
        for (let test of allTests) {
            if (!test.results) {
                skippedTests.push(test);
                continue;
            }

            // Only include tests that have at least one complete result
            // and no conflicting results
            let result;
            for (let r of Object.values(test.results)) {
                if (r.status === 'complete') {
                    if (checkForConflict(test.results).length === 0) {
                        result = r;
                        continue;
                    }
                }
            }

            if (result) {
                tests.push({
                    ...test,
                    result
                });
            } else {
                skippedTests.push(test);
            }
        }

        // This array is for caculating percentage support
        // Accross all tests for priorities 1-2
        let support = {
            1: [0, 0],
            2: [0, 0]
        };
        let totalUnexpecteds = 0;
        for (let test of tests) {
            let result = test.result.result;
            let details = result.details;
            totalUnexpecteds += parseInt(details.summary.unexpectedCount);
            for (let i = 1; i <= 2; i++) {
                support[i][0] += details.summary[i].pass;
                support[i][1] +=
                    details.summary[i].pass + details.summary[i].fail;
            }
        }

        title = `${run_status.toUpperCase()} results for ${apg_example_name} tested with ${at_name} ${at_version} on ${browser_name} ${browser_version}`;

        return (
            <Fragment>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <Container fluid>
                    <Row>
                        <Col>
                            <Fragment>
                                <h1>{title}</h1>
                            </Fragment>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>Summary of tests</h2>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Test</th>
                                        <th>
                                            <div>Required</div>
                                            <div>(pass/total)</div>
                                        </th>
                                        <th>
                                            <div>Optional</div>
                                            <div>(pass/total)</div>
                                        </th>
                                        <th>
                                            <div>Unexpected Behaviors</div>
                                            <div>(total count)</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tests.map((test, i) =>
                                        this.renderResultRow(test, i)
                                    )}
                                    <tr>
                                        <td>Support</td>
                                        <td>
                                            {support[1][1]
                                                ? `${Math.round(
                                                      (support[1][0] /
                                                          support[1][1]) *
                                                          100
                                                  )}%`
                                                : '-'}
                                        </td>
                                        <td>
                                            {support[2][1]
                                                ? `${Math.round(
                                                      (support[2][0] /
                                                          support[2][1]) *
                                                          100
                                                  )}%`
                                                : '-'}
                                        </td>
                                        <td>
                                            {totalUnexpecteds
                                                ? `${totalUnexpecteds} command(s) produced unexpected behaviors`
                                                : 'No unexpected behaviors'}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>

                            <h2>Skipped Tests</h2>
                            <p>
                                The following tests have been skipped in this
                                test run:
                            </p>
                            <ul>
                                {skippedTests.map(s => {
                                    return (
                                        <li key={nextId()}>
                                            <a
                                                href={`/aria-at/${git_hash}/${s.file}?at=${at_key}`}
                                            >
                                                {s.name}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {tests.map((t, i) => {
                                return (
                                    <Fragment key={nextId()}>
                                        <h2 id={`test-${i.toString()}`}>
                                            Details for test: {t.name}
                                        </h2>
                                        <a
                                            href={`/aria-at/${git_hash}/${t.file}?at=${at_key}`}
                                        >
                                            See test
                                        </a>
                                        <TestResult testResult={t.result} />
                                    </Fragment>
                                );
                            })}
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

RunResultsPage.propTypes = {
    dispatch: PropTypes.func,
    allTests: PropTypes.array,
    run: PropTypes.object,
    testVersion: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
    const { publishedRunsById, testVersions } = state.runs;

    const runId = parseInt(ownProps.match.params.runId);

    let run, testVersion, allTests;
    if (publishedRunsById) {
        run = publishedRunsById[runId];
    }
    if (run) {
        testVersion = (testVersions || []).find(
            v => v.id === run.test_version_id
        );
        allTests = run.tests;
    }

    return {
        run,
        allTests,
        testVersion
    };
};

export default connect(mapStateToProps)(RunResultsPage);
